<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $bezugs_id
 * @property boolean $tag_id
 * @property string $typ
 */
class References_Tags extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'zwtb_tags';

    /**
     * @var array
     */
    protected $fillable = ['bezugs_id', 'tag_id', 'typ'];

    public function tag(){
        return $this->belongsTo("App\Tag","tag_id","tag_id");
    }

}
