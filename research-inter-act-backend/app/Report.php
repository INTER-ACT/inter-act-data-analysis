<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $meldung_id
 * @property string $datum
 * @property string $typ
 * @property int $bezugs_id
 * @property int $user_id
 * @property string $grund
 * @property boolean $geloescht
 * @property string $ip
 */
class Report extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'meldungen';

    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'meldung_id';

    /**
     * @var array
     */
    protected $fillable = ['datum', 'typ', 'bezugs_id', 'user_id', 'grund', 'geloescht', 'ip'];

}
