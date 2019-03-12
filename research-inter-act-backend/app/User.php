<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Krlove\EloquentModelGenerator\Model\EloquentModel;

/**
 * @property int $user_id
 * @property string $username
 * @property string $email
 * @property string $passwort
 * @property string $vorname
 * @property string $nachname
 * @property boolean $is_male
 * @property string $plz
 * @property string $ort
 * @property string $beruf
 * @property int $geb_jahr
 * @property int $rechtskenntnisse
 * @property int $ausbildung
 * @property string $hash
 * @property boolean $gesperrt
 * @property boolean $geloescht
 * @property boolean $aktiv
 * @property string $ip
 * @property string $reg_datum
 * @property string $aktiv_datum
 */
class User extends Model
{
    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'user_id';

    /**
     * @var array
     */
    protected $fillable = ['username', 'email', 'passwort', 'vorname', 'nachname', 'is_male', 'plz', 'ort', 'beruf', 'geb_jahr', 'rechtskenntnisse', 'ausbildung', 'hash', 'gesperrt', 'geloescht', 'aktiv', 'ip', 'reg_datum', 'aktiv_datum'];

    public static function showLawsConsolidated($id)
    {
        $user = User::find($id);
        $laws = array();
        foreach (Law::all()->where('originaltext', true)->sortBy('sort') as $law):
            if ($law->allLawChanges()->count() == 0) {
                array_push($laws, [
                    'paragraph' => $law->paragraph,
                    'titel' => $law->titel,
                    'gesetzestext' => $law->gesetzestext,
                    'typ'=> 'g']);
                continue;
            }
            $lawChange = null;
            foreach ($law->allLawChanges() as $lawChange_item) {
                if ($lawChange_item->user_id == $user->user_id)
                    $lawChange = $lawChange_item;
            }
            if ($lawChange != null){
                array_push($laws, [
                    'paragraph' => Law::find($lawChange->gesetzes_id)->paragraph,
                    'titel' => $lawChange->titel_neu,
                    'gesetzestext' => $lawChange->gesetzestext_neu,
                    'typ'=> 'a']);
                continue;
            }
            $ratingAndLawChange = array();
            foreach ($law->allLawChanges() as $lawChange_item) {
                $whole_rating = 0;
                $has_rating=false;
                foreach ($lawChange_item->ratings() as $rating)
                    if ($rating->user_id == $user->user_id) {
                        $whole_rating += $rating->wertung;
                        $has_rating=true;
                    }
                if ($has_rating)
                    array_push($ratingAndLawChange,['lawChange'=>$lawChange_item,'rating'=>$whole_rating]);
            }
            if (count($ratingAndLawChange)<1){
                array_push($laws, [
                    'paragraph' => $law->paragraph,
                    'titel' => $law->titel,
                    'gesetzestext' => $law->gesetzestext,
                    'typ'=> 'g']);
                continue;
            }
            $lawChange_rating=null;
            foreach ($ratingAndLawChange as $ral){
                if ($lawChange_rating==null)
                    $lawChange_rating=$ral;
                elseif ($lawChange_rating['rating']<=$ral['rating'])
                    $lawChange_rating=$ral;
            }
            array_push($laws, [
                'paragraph' => Law::find($lawChange_rating['lawChange']->gesetzes_id)->paragraph,
                'titel' => $lawChange_rating['lawChange']->titel_neu,
                'gesetzestext' => $lawChange_rating['lawChange']->gesetzestext_neu,
                'typ'=> 'a']);
        endforeach;
        return $laws;

    }


}
