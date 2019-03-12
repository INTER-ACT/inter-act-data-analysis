<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use League\Csv\Reader;
use League\Csv\Writer;
use phpDocumentor\Reflection\Types\Integer;
use PhpParser\Comment;
use PhpParser\Node\Expr\Cast\Double;

/**
 * @property int $gesetzes_id
 * @property string $gesetz
 * @property string $paragraph
 * @property string $titel
 * @property string $gesetzestext
 * @property string $erklaerung
 * @property string $bgbl
 * @property boolean $frei
 * @property boolean $originaltext
 * @property string $datum
 * @property int $user_id
 * @property string $ip
 * @property integer $sort
 */
class Law extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'gesetze';

    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'gesetzes_id';

    /**
     * @var array
     */
    protected $fillable = ['gesetz', 'paragraph', 'titel', 'gesetzestext', 'erklaerung', 'bgbl', 'frei', 'originaltext', 'datum', 'user_id', 'ip', 'sort'];

    public static function getLaws(){
        $laws=Law::all()->where('originaltext',true);
        foreach ($laws as $law){
            $law["conversationRate"]=$law->conversationRate();
            $law["ratingsRate"]=$law->ratingsRate();
        }
        return $laws;
    }

    public function conversationRate(){
        ini_set('max_execution_time', 1000);
        $conversationRate=($this->allComments()->count())*6;
        $conversationRate=$conversationRate+($this->ratings()->count());

        $directLawChanges=$this->directLawChanges();

        foreach ($directLawChanges as $directLawChange){
            $tempConvRate=$directLawChange->conversationRate();
            if ($tempConvRate>8)
                $conversationRate=$conversationRate+$tempConvRate;
            else
                $conversationRate=$conversationRate+8;
        }

        return $conversationRate;
    }

    public function ratingsRate(){
        $ratingsRate=0;
        foreach ($this->ratings() as $rating)
            ($rating->wertung==1)?$ratingsRate++:(($rating->wertung==0)?null:$ratingsRate--);
        if ($this->ratings()->count()>0)
        return ($ratingsRate/$this->ratings()->count())*100;
        return 0;
    }

    public function directLawChanges(){
        return $this->hasMany('App\LawChange','aenderungs_bezugs_id')->where('typ','g')->get();
    }

    public function allLawChanges(){
        $directLawChanges=$this->directLawChanges();
        $allLawChanges=collect();
        foreach ($directLawChanges as $directLawChange){
            $allLawChanges->push($directLawChange);
            $lawChangeCollection=$directLawChange->allLawChanges();
            $allLawChanges=$allLawChanges->merge($lawChangeCollection);
        }
        return $allLawChanges;
    }

    public function references_tags()
    {
        return $this->hasMany('App\References_Tags', 'bezugs_id')->where('typ', 'g')->get();
    }

    public function directComments(){
        return $this->hasMany('App\Comment','kommentar_bezugs_id')->where('typ','g')->get();
    }

    public function statistics(){
        return $this->hasMany('App\Statistic','gesetzes_id')->get();
    }

    public function allComments(){
        $directComments=$this->directComments();
        $allComments=collect();
        foreach ($directComments as $directComment){
            $allComments->push($directComment);
            $commentCollection=$directComment->allComments();
            $allComments=$allComments->merge($commentCollection);
        }
        return $allComments;
    }

    public function ratings(){
        return $this->hasMany('App\Rating','rating_bezugs_id')->where('typ','g')->get();
    }

    public static function showLawsConsolidated()
    {
        $laws = array();
        foreach (Law::all()->where('originaltext', true)->sortBy('sort') as $law)
        {
            if ($law->allLawChanges()->count() != 0) {
                $lawChange = null;
            foreach ($law->allLawChanges() as $lawChange_item) {
                if ($lawChange_item->consolidatedRate() > $law->consolidatedRate())
                    $lawChange = $lawChange_item;
            }
            if ($lawChange != null) {
                array_push($laws, [
                    'paragraph' => Law::find($lawChange->gesetzes_id)->paragraph,
                    'titel' => $lawChange->titel_neu,
                    'gesetzestext' => $lawChange->gesetzestext_neu,
                    'typ' => 'a']);
                continue;
            }
        }
        array_push($laws, [
                'paragraph' => $law->paragraph,
                'titel' => $law->titel,
                'gesetzestext' => $law->gesetzestext,
                'typ'=> 'g']);
        };
        return $laws;
    }

    public function consolidatedRate(){
        ini_set('max_execution_time', 1000);
        $factors=Setting::all();
        $possibleValues=[0.1,0.2,0.3,1,2,3,4];
        for($y=0; $y<6; $y++)
        {
            for ($i=0; $i<6; $i++)
            {
                if($factors[$y]->wert==$i)
                {
                    $factors[$y]->wert=$possibleValues[$i];
                }
            }
        }
        $conversationRate=($this->allComments()->count())*6*$factors[3]->wert;
        $conversationRate=$conversationRate+($this->ratings()->count()*$factors[1]->wert);
        $conversationRate=$conversationRate+$this->sumLawChanges()*$factors[4]->wert;
        $conversationRate=$conversationRate+$this->sumLawChangesRatings()*$factors[5]->wert;
        $ratingsRate=0;
        foreach ($this->ratings() as $rating)
            ($rating->wertung==1)?$ratingsRate++:(($rating->wertung==0)?null:$ratingsRate--);

        $conversationRate=$conversationRate+$ratingsRate*$factors[0]->wert;
        $commentrating=0;
        foreach ( $this->allComments() as $comment)
        {
            $comment["kommentare_likes"]=$comment->comments_likes();
            if($comment->kommentarelikes!= null) {
                foreach ($comment->kommentarelikes as $comrating) {
                    $commentrating = $commentrating + $comrating->bewertung;
                }
            }
        }
        $conversationRate=$conversationRate+$commentrating*$factors[2]->wert;
        return $conversationRate;
    }

    public  function sumLawChanges()
    {   $sum=$this->directLawChanges()->count();
        $directLawChanges=$this->directLawChanges();
        foreach ($directLawChanges as $directLawChange){
            $sum=$sum+$directLawChange->sumLawChanges();
        }
        return $sum;
    }

    public  function sumLawChangesRatings()
    {   $lawChangeRating=0;
        $directLawChanges=$this->directLawChanges();

        foreach ($directLawChanges as $directLawChange){
            foreach ( $directLawChange->allComments() as $comment)
            {

                $comment["kommentare_likes"]=$comment->comments_likes();
                if($comment->kommentarelikes!= null) {
                    foreach ($comment->kommentarelikes as $changeRating) {
                        $lawChangeRating = $lawChangeRating + $changeRating->bewertung;

                    }
                }
                $lawChangeRating= $lawChangeRating+$directLawChange->sumLawChangesRatings();
            }
        }
        return $lawChangeRating;
    }

}
