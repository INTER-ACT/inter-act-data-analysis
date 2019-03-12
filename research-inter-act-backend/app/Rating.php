<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $rating_id
 * @property integer $user_id
 * @property string $typ
 * @property boolean $aspect
 * @property boolean $wertung
 * @property int $rating_bezugs_id
 * @property string $datum
 * @property string $ip
 */
class Rating extends Model
{
    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'rating_id';

    /**
     * @var array
     */
    protected $fillable = ['user_id', 'typ', 'aspect', 'wertung', 'rating_bezugs_id', 'datum', 'ip'];

}
