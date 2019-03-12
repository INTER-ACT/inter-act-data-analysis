<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $aenderungs_id
 * @property integer $gesetzes_id
 * @property integer $user_id
 * @property string $titel_neu
 * @property string $gesetzestext_neu
 * @property string $begruendung
 * @property string $typ
 * @property int $aenderungs_bezugs_id
 * @property string $datum
 * @property string $ip
 * @property boolean $geloescht
 */
class LawChange extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'aenderungen';

    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'aenderungs_id';

    /**
     * @var array
     */
    protected $fillable = ['gesetzes_id', 'user_id', 'titel_neu', 'gesetzestext_neu', 'begruendung', 'typ', 'aenderungs_bezugs_id', 'datum', 'ip', 'geloescht'];


    public function conversationRate(){
        ini_set('max_execution_time', 1000);
        $conversationRate=$this->allComments()->count();
        $conversationRate=round($conversationRate+($this->ratings()->count())/3);

        $directLawChanges=$this->directLawChanges();

        foreach ($directLawChanges as $directLawChange){
            $tempConvRate=$directLawChange->conversationRate();
            if ($tempConvRate>1)
                $conversationRate=$conversationRate+$tempConvRate+1;
            else
                $conversationRate=$conversationRate+1;
        }
        return $conversationRate;
    }

    public function OwnConversationRate(){
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

    public function reference()
    {
        if ($this->typ == 'v')
            return $this->belongsTo('App\LawChange', 'aenderungs_bezugs_id')->get();
        else if ($this->typ == 'g')
            return $this->belongsTo('App\Law', 'aenderungs_bezugs_id')->get();
    }

    public function directLawChanges(){
        return $this->hasMany('App\LawChange','aenderungs_bezugs_id')->where('typ','v')->get();
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

    public function directComments(){
        return $this->hasMany('App\Comment','kommentar_bezugs_id')->where('typ','v')->get();
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
        return $this->hasMany('App\Rating','rating_bezugs_id')->where('typ','v')->get();
    }


    public function references_tags()
    {
        return $this->hasMany('App\References_Tags', 'bezugs_id')->where('typ', 'v')->get();
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
