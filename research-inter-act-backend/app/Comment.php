<?php

namespace App;

use http\Env\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use League\Csv\CharsetConverter;
use League\Csv\Reader;
use League\Csv\Writer;
use phpDocumentor\Reflection\Types\Integer;
use PhpParser\Node\Scalar\String_;
use ZipArchive;

/**
 * @property int $kommentar_id
 * @property int $user_id
 * @property string $typ
 * @property int $kommentar_bezugs_id
 * @property string $kommentar
 * @property integer $likes
 * @property string $datum
 * @property string $ip
 * @property boolean $geloescht
 */
class Comment extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'kommentare';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'kommentar_id';

    /**
     * @var array
     */
    protected $fillable = ['user_id', 'typ', 'kommentar_bezugs_id', 'kommentar', 'likes', 'datum', 'ip', 'geloescht'];


    public function comments_likes()
    {
        return $this->hasMany('App\Comments_Likes', 'kommentar_id')->get();
    }


    public function directComments()
    {
        return $this->hasMany('App\Comment', 'kommentar_bezugs_id')->where('typ', 'k')->get();
    }

    public function reference()
    {
        if ($this->typ == 'v')
            return $this->belongsTo('App\LawChange', 'kommentar_bezugs_id')->get();
        else if ($this->typ == 'g')
            return $this->belongsTo('App\Law', 'kommentar_bezugs_id')->get();
        else if ($this->typ == 'k')
            return $this->belongsTo('App\Comment', 'kommentar_bezugs_id')->get();
    }

    public function references_tags()
    {
        return $this->hasMany('App\References_Tags', 'bezugs_id')->where('typ', 'k')->get();
    }

    public function allComments()
    {
        $directComments = $this->directComments();
        $allComments = collect();
        foreach ($directComments as $directComment) {
            $allComments->push($directComment);
            $commentCollection = $directComment->allComments();
            $allComments = $allComments->merge($commentCollection);
        }
        return $allComments;
    }

    public static function export($id)
    {
        $comments = $id == 0 ? Comment::all() : Comment::find($id)->allComments();

        $columns = array('Kommentar_id', 'User_id', 'Referenz', 'Kommentar_Bezugs_id', 'Kommentar',
            'Likes', 'Datum');
        $callback = function () use ($comments, $columns) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $columns, config('custom.delimiter'));

            foreach ($comments as $comment) {
                $referenz_string = "Änderungsvorschlag";
                $kommentar_string = html_entity_decode(strip_tags($comment->kommentar));
                if ($comment->typ == 'g') $referenz_string = "Gesetz";
                elseif ($comment->typ == 'k') $referenz_string = "Kommentar";
                if ($comment->geloescht == 0)
                    fputcsv($file, array($comment->kommentar_id, $comment->user_id, $referenz_string,
                        $comment->kommentar_bezugs_id, $kommentar_string, $comment->likes,
                        date('d.m.Y H:i:s', strtotime($comment->datum))), config('custom.delimiter'));
            }
            fclose($file);
        };
        return $callback;

    }

    public static function exportOne($id, $comment_id)
    {
        $comment = Comment::find($id);

        $columns = array('Kommentar_id', 'User_id', 'Referenz', 'Kommentar_Bezugs_id', 'Kommentar',
            'Likes', 'Datum');
        $callback = function () use ($comment, $columns) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $columns, config('custom.delimiter'));

            $referenz_string = "Änderungsvorschlag";
            $kommentar_string = html_entity_decode(strip_tags($comment->kommentar));
            if ($comment->typ == 'g') $referenz_string = "Gesetz";
            elseif ($comment->typ == 'k') $referenz_string = "Kommentar";
            if ($comment->geloescht == 0)
                fputcsv($file, array($comment->kommentar_id, $comment->user_id, $referenz_string,
                    $comment->kommentar_bezugs_id, $kommentar_string, $comment->likes,
                    date('d.m.Y H:i:s', strtotime($comment->datum))), config('custom.delimiter'));
            fclose($file);
        };

        return $callback;
    }

    public static function exportOneWithParams($id, array $params)
    {
        $comment = Comment::find($id);
        $columns = $params;
        $comments = $comment->allComments();
        $tags = array();
        $references_tags = $comment->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($tags, $reference_tag->tag->tag);
        $callback = function () use ($comment, $columns, $comments, $tags) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $columns, config('custom.delimiter'));

                if ($comments != null AND count($comments) > count($tags))
                    for ($i = 0; $i < count($comments); $i++) {
                        $line = array();
                        foreach ($columns as $column)
                            array_push($line, self::getColumnValue($i, $column, $comment, $comments, $tags));
                        fputcsv($file, $line, config('custom.delimiter'));
                    }
                elseif (count($tags) != null)
                    for ($i = 0; $i < count($tags); $i++) {
                        $line = array();
                        foreach ($columns as $column)
                            array_push($line, self::getColumnValue($i, $column, $comment, $comments, $tags));
                        fputcsv($file, $line, config('custom.delimiter'));
                    }
                else
                    for ($i = 0; $i < 1; $i++) {
                        $line = array();
                        foreach ($columns as $column)
                            array_push($line, self::getColumnValue($i, $column, $comment, $comments, $tags));
                        fputcsv($file, $line, config('custom.delimiter'));
                    }
        };

        return $callback;

    }

    /**
     * @param $id
     * @return array
     * @throws \League\Csv\CannotInsertRecord
     * @throws \League\Csv\Exception
     */
    public static function exportZip($id)
    {
        $comments = $id == 0 ? Comment::all() : Comment::find($id)->directComments();

        $columns = array('Kommentar_id', 'User_id', 'Referenz', 'Kommentar_Bezugs_id', 'Kommentar',
            'Likes', 'Datum');
        $filename = "Kommentar" . $id . "_Kommentare.csv";
        $csv = Writer::createFromStream(fopen('php://temp', 'r+'));
        $csv->setDelimiter(config('custom.delimiter'));
        $csv->setOutputBOM(Reader::BOM_UTF8);
        $csv->insertOne($columns);

        foreach ($comments as $comment) {
            $referenz_string = "Änderungsvorschlag";
            $kommentar_string = html_entity_decode(strip_tags($comment->kommentar));
            if ($comment->typ == 'g') $referenz_string = "Gesetz";
            elseif ($comment->typ == 'k') $referenz_string = "Kommentar";
            if ($comment->geloescht == 0)
                $csv->insertOne(array($comment->kommentar_id, $comment->user_id, $referenz_string,
                    $comment->kommentar_bezugs_id, $kommentar_string, $comment->likes,
                    date('d.m.Y H:i:s', strtotime($comment->datum))));
        }
        return ["filename" => $filename, "file" => $csv->getContent()];
    }


    /**
     * @param $id
     * @param $comment_id
     * @return array
     * @throws \League\Csv\CannotInsertRecord
     * @throws \League\Csv\Exception
     */
    public static function exportOneAsReferenceZip($id, $comment_id)
    {
        $comment = Comment::find($id);

        $columns = array('Kommentar_id', 'User_id', 'Referenz', 'Kommentar_Bezugs_id', 'Kommentar',
            'Likes', 'Datum');
        $filename = "Kommentar" . $comment_id . "_Referenz_" . "Kommentar" . $id . ".csv";
        $csv = Writer::createFromStream(fopen('php://temp', 'r+'));
        $csv->setDelimiter(config('custom.delimiter'));
        $csv->setOutputBOM(Reader::BOM_UTF8);
        $csv->insertOne($columns);

        $referenz_string = "Änderungsvorschlag";
        $kommentar_string = html_entity_decode(strip_tags($comment->kommentar));
        if ($comment->typ == 'g') $referenz_string = "Gesetz";
        elseif ($comment->typ == 'k') $referenz_string = "Kommentar";
        if ($comment->geloescht == 0)
            $csv->insertOne(array($comment->kommentar_id, $comment->user_id, $referenz_string,
                $comment->kommentar_bezugs_id, $kommentar_string, $comment->likes,
                date('d.m.Y H:i:s', strtotime($comment->datum))));

        return ["filename" => $filename, "file" => $csv->getContent()];
    }

    /**
     * @param $id
     * @param array $params
     * @return array
     * @throws \League\Csv\CannotInsertRecord
     * @throws \League\Csv\Exception
     */
    public static function exportOneWithParamsZip($id, array $params)
    {
        $comment = Comment::find($id);
        $columns = $params;
        $comments = $comment->directComments();
        $tags = array();
        $references_tags = $comment->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($tags, $reference_tag->tag->tag);
        $filename = 'Kommentar' . $comment->kommentar_id . ".csv";
        $csv = Writer::createFromStream(fopen('php://temp', 'r+'));
        $csv->setOutputBOM(Reader::BOM_UTF8);
        $csv->setDelimiter(config('custom.delimiter'));
        $csv->insertOne($columns);

        if ($comment->geloescht == 0) {
            if ($comments != null AND count($comments) > count($tags))
                for ($i = 0; $i < count($comments); $i++) {
                    $line = array();
                    foreach ($columns as $column)
                        array_push($line, self::getColumnValue($i, $column, $comment, $comments, $tags));
                    $csv->insertOne($line);
                }
            elseif (count($tags) != null)
                for ($i = 0; $i < count($tags); $i++) {
                    $line = array();
                    foreach ($columns as $column)
                        array_push($line, self::getColumnValue($i, $column, $comment, $comments, $tags));
                    $csv->insertOne($line);
                }

            else
                for ($i = 0; $i < 1; $i++) {
                    $line = array();
                    foreach ($columns as $column)
                        array_push($line, self::getColumnValue($i, $column, $comment, $comments, $tags));
                    $csv->insertOne($line);
                }

        }

        return ["filename" => $filename, "file" => $csv->getContent()];
    }


    private
    static function getColumnValue($i, $column, $comment, $comments, $tags)
    {
        if ($column == "Kommentar_id") {
            if ($i == 0)
                return $comment->kommentar_id;
            return "";
        }
        if ($column == "User_id") {
            if ($i == 0)
                return $comment->user_id;
            return "";
        }
        if ($column == "Referenz") {
            if ($i == 0) {
                if ($comment->typ == "k")
                    return "Kommentar";
                elseif ($comment->typ == "g")
                    return "Gesetz";
                else
                    return "Änderungsvorschlag";
            }
            return "";
        }
        if ($column == "Kommentar_Bezugs_id") {
            if ($i == 0)
                return $comment->kommentar_bezugs_id;
            return "";
        }
        if ($column == "Kommentar") {
            if ($i == 0)
                return html_entity_decode(strip_tags($comment->kommentar));
            return "";
        }
        if ($column == "Likes") {
            if ($i == 0)
                return $comment->likes;
            return "";
        }
        if ($column == "Kommentare_id") {
            if (isset($comments[$i]))
                return $comments[$i]->kommentar_id;
            return "";
        }
        if ($column == "Tags") {
            if (isset($tags[$i]))
                return $tags[$i];
            return "";
        }
        if ($column == "Datum") {
            if ($i == 0)
                return date('d.m.Y H:i:s', strtotime($comment->datum));
            return "";
        }
        return "error";
    }
}
