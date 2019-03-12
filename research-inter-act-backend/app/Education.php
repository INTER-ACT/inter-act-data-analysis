<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property boolean $ausbildungs_id
 * @property string $ausbildung
 */
class Education extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'ausbildung';

    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'ausbildungs_id';

    /**
     * The "type" of the auto-incrementing ID.
     * 
     * @var string
     */
    protected $keyType = 'integer';

    /**
     * @var array
     */
    protected $fillable = ['ausbildung'];


    public function users(){
        return $this->hasMany('App\User','ausbildung');
    }

}
