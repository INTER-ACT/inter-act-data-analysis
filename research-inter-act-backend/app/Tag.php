<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property boolean $tag_id
 * @property string $tag
 * @property string $tag_beschreibung
 */
class Tag extends Model
{
    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'tag_id';

    /**
     * The "type" of the auto-incrementing ID.
     * 
     * @var string
     */
    protected $keyType = 'integer';

    /**
     * @var array
     */
    protected $fillable = ['tag', 'tag_beschreibung'];


    public function references_tags(){
        return $this->hasMany('App\References_Tags',"tag_id");
    }
}
