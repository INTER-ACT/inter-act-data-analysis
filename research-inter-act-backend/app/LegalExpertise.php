<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property boolean $rechtskenntnis_id
 * @property string $rechtskenntnis
 */
class LegalExpertise extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'rechtskenntnisse';

    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'rechtskenntnis_id';

    /**
     * The "type" of the auto-incrementing ID.
     * 
     * @var string
     */
    protected $keyType = 'integer';

    /**
     * @var array
     */
    protected $fillable = ['rechtskenntnis'];


    public function users(){
        return $this->hasMany('App\User','rechtskenntnisse');
    }
}
