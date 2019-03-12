<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $statistik_id
 * @property int $gesetzes_id
 * @property int $user_id
 * @property string $link_ort
 * @property string $datum
 */
class Statistic extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'statistiken';

    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'statistik_id';

    /**
     * @var array
     */
    protected $fillable = ['gesetzes_id', 'user_id', 'link_ort', 'datum'];


    public $timestamps = false;
}
