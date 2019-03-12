<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $like_id
 * @property int $kommentar_id
 * @property integer $user_id
 * @property string $datum
 * @property string $ip
 * @property boolean $bewertung
 */
class Comments_Likes extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'kommentar_likes';

    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'like_id';

    /**
     * @var array
     */
    protected $fillable = ['kommentar_id', 'user_id', 'datum', 'ip', 'bewertung'];

}
