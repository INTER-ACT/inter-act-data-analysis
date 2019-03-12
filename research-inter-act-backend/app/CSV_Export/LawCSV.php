<?php
/**
 * Created by PhpStorm.
 * User: Stefan
 * Date: 28/12/2018
 * Time: 14:16
 */

namespace App\CSV_Export;


use App\Law;
use League\Csv\Reader;
use League\Csv\Writer;

class LawCSV
{
    public static function exportAll()
    {
        $laws = Law::all();
        $columns = array('Gesetzes_id', 'Gesetz', 'Paragraph', 'Titel', 'Gesetzestext',
            'Erklärung', 'Bundesgesetzblatt', 'Originaltext', 'Datum', 'User_id');

        $callback = function () use ($laws, $columns) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $columns, config('custom.delimiter'));

            foreach ($laws as $law) {
                $originaltext_string = "Ja";
                $erklearung_string = strip_tags($law->erklaerung);
                if ($law->originaltext != 1) $originaltext_string = "Nein";
                if ($law->frei == 1)
                    fputcsv($file, array($law->gesetzes_id, $law->gesetz, $law->paragraph,
                        $law->titel, $law->gesetzestext, $erklearung_string, $law->bgbl,
                        $originaltext_string, ($law->datum == "") ? "" : date('d.m.Y H:i:s', strtotime($law->datum)),
                        $law->user_id), config('custom.delimiter'));
            }
            fclose($file);
        };
        return $callback;
    }

    /**
     * @param int $gesetzes_id
     * @param $id
     * @param string $typ
     * @return array
     * @throws \League\Csv\CannotInsertRecord
     * @throws \League\Csv\Exception
     */
    public static function exportOneAsReferenceZip(int $gesetzes_id, $id, string $typ)
    {
        $law = Law::find($gesetzes_id);
        $comments = $law->directComments();
        $ratings = $law->ratings();
        $lawChanges = $law->directLawChanges();
        $tags = array();
        $references_tags = $law->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($tags, $reference_tag->tag->tag);

        $columns = array('Gesetzes_id', 'Gesetz', 'Paragraph', 'Titel', 'Gesetzestext',
            'Erklärung', 'Bundesgesetzblatt', 'Änderungen_id', 'Kommentare_id', 'Ratings_id', 'Tags', 'Originaltext', 'Datum', 'User_id');
        $filename = "";
        if ($typ == 'k')
            $filename = "Kommentar" . $id . "_Referenz_" . "Paragraph" . $gesetzes_id . ".csv";
        if ($typ == 'v')
            $filename = "Änderungsvorschlag" . $id . "_Referenz_" . "Paragraph" . $gesetzes_id . ".csv";
        $csv = Writer::createFromStream(fopen('php://temp', 'r+'));
        $csv->setDelimiter(config('custom.delimiter'));
        $csv->setOutputBOM(Reader::BOM_UTF8);
        $csv->insertOne($columns);

        $linesCount = self::getLinesCount($lawChanges, $comments, $ratings, $tags);

        for ($i = 0; $i < $linesCount; $i++) {
            $csv->insertOne(self::createCSVArray($i, $law, $lawChanges, $comments, $ratings, $tags));
        }
        return ["filename" => $filename, "file" => $csv->getContent()];
    }

    public static function exportOne($id)
    {
        $law = Law::find($id);
        $comments = $law->directComments();
        $ratings = $law->ratings();
        $lawChanges = $law->directLawChanges();
        $tags = array();
        $references_tags = $law->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($tags, $reference_tag->tag->tag);

        $linesCount = self::getLinesCount($lawChanges, $comments, $ratings, $tags);

        $columns = array('Gesetzes_id', 'Gesetz', 'Paragraph', 'Titel', 'Gesetzestext',
            'Erklärung', 'Bundesgesetzblatt', 'Änderungen_id', 'Kommentare_id', 'Ratings_id', 'Tags', 'Originaltext', 'Datum', 'User_id');

        $callback = function () use ($law, $columns, $lawChanges, $comments, $ratings, $tags, $linesCount) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $columns, config('custom.delimiter'));
            for ($i = 0; $i < $linesCount; $i++) {
                fputcsv($file, self::createCSVArray($i, $law, $lawChanges, $comments, $ratings, $tags), config('custom.delimiter'));
            }
            fclose($file);
        };
        return $callback;
    }


    public static function exportOneWithParams($id, array $params)
    {
        $law = Law::find($id);
        $comments = $law->directComments();
        $columns = $params;
        $ratings = $law->ratings();
        $lawChanges = $law->directLawChanges();
        $tags = array();
        $references_tags = $law->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($tags, $reference_tag->tag->tag);
        $linesCount = self::getLinesCount($lawChanges, $comments, $ratings, $tags);

        $callback = function () use ($law, $columns, $lawChanges, $comments, $ratings, $tags, $linesCount) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $columns, config('custom.delimiter'));

            for ($i = 0; $i < $linesCount; $i++) {
                $line = array();
                foreach ($columns as $column)
                    array_push($line, self::getColumnValue($i, $law, $column, $lawChanges, $comments, $ratings, $tags));
                fputcsv($file, $line, config('custom.delimiter'));
            }
        };
        return $callback;
    }

    public static function exportOneWithParamsZip($id, array $params)
    {
        $law = Law::find($id);
        $comments = $law->directComments();
        $columns = $params;
        $ratings = $law->ratings();
        $lawChanges = $law->directLawChanges();
        $tags = array();
        $references_tags = $law->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($tags, $reference_tag->tag->tag);
        $filename = 'Paragraph' . $law->gesetzes_id . ".csv";
        $csv = Writer::createFromStream(fopen('php://temp', 'r+'));
        $csv->setOutputBOM(Reader::BOM_UTF8);
        $csv->setDelimiter(config('custom.delimiter'));
        $csv->insertOne($columns);
        $linesCount = self::getLinesCount($lawChanges, $comments, $ratings, $tags);

        for ($i = 0; $i < $linesCount; $i++) {
            $line = array();
            foreach ($columns as $column)
                array_push($line, self::getColumnValue($i, $law, $column, $lawChanges, $comments, $ratings, $tags));
            $csv->insertOne($line);
        }
        return ["filename" => $filename, "file" => $csv->getContent()];
    }

    public static function createCSVArray(int $i, Law $law, $lawChanges, $comments, $ratings, $tags)
    {
        $returnArray = array();
        if ($i == 0) {
            array_push($returnArray, $law->gesetzes_id);
            array_push($returnArray, $law->gesetz);
            array_push($returnArray, $law->paragraph);
            array_push($returnArray, $law->titel);
            array_push($returnArray, $law->gesetzestext);
            array_push($returnArray, html_entity_decode(strip_tags($law->erklaerung)));
            array_push($returnArray, $law->bgbl);
            if (isset($lawChanges[0]))
                array_push($returnArray, $lawChanges[0]->aenderungs_id);
            else
                array_push($returnArray, "");
            if (isset($comments[0]))
                array_push($returnArray, $comments[0]->kommentar_id);
            else
                array_push($returnArray, "");
            if (isset($ratings[0]))
                array_push($returnArray, $ratings[0]->rating_id);
            else
                array_push($returnArray, "");
            if (isset($tags[0]))
                array_push($returnArray, $tags[0]);
            else
                array_push($returnArray, "");
            if ($law->originaltext)
                array_push($returnArray, "Ja");
            else
                array_push($returnArray, "Nein");
            if ($law->datum != "")
                array_push($returnArray, date('d.m.Y H:i:s', strtotime($law->datum)));
            else
                array_push($returnArray, "");
            array_push($returnArray, $law->user_id);
        } else {
            array_push($returnArray, "");
            array_push($returnArray, "");
            array_push($returnArray, "");
            array_push($returnArray, "");
            array_push($returnArray, "");
            array_push($returnArray, "");
            array_push($returnArray, "");
            if (isset($lawChanges[$i]))
                array_push($returnArray, $lawChanges[$i]->aenderungs_id);
            else
                array_push($returnArray, "");
            if (isset($comments[$i]))
                array_push($returnArray, $comments[$i]->kommentar_id);
            else
                array_push($returnArray, "");
            if (isset($ratings[$i]))
                array_push($returnArray, $ratings[$i]->rating_id);
            else
                array_push($returnArray, "");
            if (isset($tags[$i]))
                array_push($returnArray, $tags[$i]);
            else
                array_push($returnArray, "");
        }
        return $returnArray;
    }

    public static function getLinesCount($lawChanges, $comments, $ratings, $tags)
    {
        $linesCount = 1;
        if ($lawChanges != null)
            if (count($lawChanges) >= count($comments) && count($lawChanges) >= count($tags) && count($lawChanges) >= count($ratings))
                $linesCount = count($lawChanges);
        if ($comments != null)
            if (count($comments) >= count($lawChanges) && count($comments) >= count($tags) && count($comments) >= count($ratings))
                $linesCount = count($comments);
        if ($tags != null)
            if (count($tags) >= count($lawChanges) && count($tags) >= count($comments) && count($tags) >= count($ratings))
                $linesCount = count($tags);
        if ($ratings != null)
            if (count($ratings) >= count($lawChanges) && count($ratings) >= count($comments) && count($ratings) >= count($tags))
                $linesCount = count($ratings);
        return $linesCount;
    }

    private static function getColumnValue(int $i, Law $law, $column, $lawChanges, $comments, $ratings, $tags)
    {
        if ($column == "Gesetzes_id") {
            if ($i == 0)
                return $law->gesetzes_id;
            return "";
        }
        if ($column == "Gesetz") {
            if ($i == 0)
                return $law->user_id;
            return "";
        }
        if ($column == "Paragraph") {
            if ($i == 0)
                return $law->paragraph;
            return "";
        }
        if ($column == "Titel") {
            if ($i == 0)
                return $law->titel;
            return "";
        }
        if ($column == "Gesetzestext") {
            if ($i == 0)
                return $law->gesetzestext;
            return "";
        }
        if ($column == "Erklärung") {
            if ($i == 0)
                return html_entity_decode(strip_tags($law->erklaerung));
            return "";
        }
        if ($column == "Bundesgesetzblatt") {
            if ($i == 0)
                return $law->bgbl;
            return "";
        }
        if ($column == "Änderungen_id") {
            if (isset($lawChanges[$i]))
                return $lawChanges[$i]->aenderungs_id;
            return "";
        }
        if ($column == "Kommentare_id") {
            if (isset($comments[$i]))
                return $comments[$i]->kommentar_id;
            return "";
        }
        if ($column == "Ratings_id") {
            if (isset($ratings[$i]))
                return $ratings[$i]->rating_id;
            return "";
        }
        if ($column == "Tags") {
            if (isset($tags[$i]))
                return $tags[$i];
            return "";
        }
        if ($column == "Originaltext") {
            if ($i == 0)
                return $law->originaltext ? "Ja" : "Nein";
            return "";
        }
        if ($column == "Datum") {
            if ($i == 0 AND $law->datum != null)
                return date('d.m.Y H:i:s', strtotime($law->datum));
            return "";
        }
        if ($column == "User_id") {
            if ($i == 0)
                return $law->user_id;
            return "";
        }
        return "error";
    }
}