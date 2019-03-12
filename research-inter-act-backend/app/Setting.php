<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property boolean $einstellung_id
 * @property string $faktor
 * @property boolean $wert
 */
class Setting extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'einstellungen';

    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'einstellung_id';

    /**
     * The "type" of the auto-incrementing ID.
     * 
     * @var string
     */
    protected $keyType = 'integer';

    /**
     * @var array
     */
    protected $fillable = ['faktor', 'wert'];

    public $timestamps = false;

}
