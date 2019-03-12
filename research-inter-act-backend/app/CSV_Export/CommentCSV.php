<?php
/**
 * Created by PhpStorm.
 * User: Stefan
 * Date: 28/12/2018
 * Time: 22:07
 */

namespace App\CSV_Export;


use League\Csv\Reader;
use League\Csv\Writer;

class CommentCSV
{

    public static function exportComments($comments)
    {
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
    public static function exportCommentsZip($comments,$id,$typ)
    {
        $columns = array('Kommentar_id', 'User_id', 'Referenz', 'Kommentar_Bezugs_id', 'Kommentar',
            'Likes', 'Datum');
        $filename = "Paragraph" . $id . "_Kommentare.csv";
        if ($typ=='k')
            $filename = "Kommentar" . $id . "_Kommentare.csv";
        elseif ($typ=='v')
            $filename = "Änderungsvorschlag" . $id . "_Kommentare.csv";
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
}