<?php
/**
 * Created by PhpStorm.
 * User: Stefan
 * Date: 28/12/2018
 * Time: 21:49
 */

namespace App\CSV_Export;


use League\Csv\Reader;
use League\Csv\Writer;

class RatingCSV
{
    public static function exportRatings($ratings){
        $columns = array('Rating_id','User_id', 'Referenz', 'Aspekt', 'Wertung',
            'Rating_Bezugs_id', 'Datum');

        $callback = function() use ($ratings, $columns)
        {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($file, $columns,config('custom.delimiter'));

            foreach($ratings as $rating) {
                $referenz_string="Änderungsvorschlag";
                $aspekt_string="Verständlichkeit";
                if ($rating->typ=='g') $referenz_string="Gesetz";
                if ($rating->aspect==1) $aspekt_string="Fairness";
                elseif ($rating->aspect==2) $aspekt_string="Dafür/Dagegen";
                if ($rating->geloescht == 0)
                fputcsv($file, array($rating->rating_id,$rating->user_id, $referenz_string,
                    $aspekt_string, $rating->wertung, $rating->rating_bezugs_id,
                    date('d.m.Y H:i:s',strtotime($rating->datum))),config('custom.delimiter'));
            }
            fclose($file);
        };
        return $callback;
    }
    public static function exportRatingsZip($ratings,$id,$typ)
    {
        $columns = array('Rating_id', 'User_id', 'Referenz', 'Aspekt', 'Wertung',
            'Rating_Bezugs_id', 'Datum');
        $filename = "Paragraph" . $id . "_Ratings.csv";
        if ($typ == 'k')
            $filename = "Kommentar" . $id . "_Ratings.csv";
        elseif ($typ == 'v')
            $filename = "Änderungsvorschlag" . $id . "_Ratings.csv";
        $csv = Writer::createFromStream(fopen('php://temp', 'r+'));
        $csv->setDelimiter(config('custom.delimiter'));
        $csv->setOutputBOM(Reader::BOM_UTF8);
        $csv->insertOne($columns);

        foreach ($ratings as $rating) {
            $referenz_string = "Änderungsvorschlag";
            $aspekt_string = "Verständlichkeit";
            if ($rating->typ == 'g') $referenz_string = "Gesetz";
            if ($rating->aspect == 1) $aspekt_string = "Fairness";
            elseif ($rating->aspect == 2) $aspekt_string = "Dafür/Dagegen";
            if ($rating->geloescht == 0)
                $csv->insertOne(array($rating->rating_id, $rating->user_id, $referenz_string,
                    $aspekt_string, $rating->wertung, $rating->rating_bezugs_id,
                    date('d.m.Y H:i:s', strtotime($rating->datum))));
        }
        return ["filename" => $filename, "file" => $csv->getContent()];
    }
}