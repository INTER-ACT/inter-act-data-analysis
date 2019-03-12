<?php
/**
 * Created by PhpStorm.
 * User: Stefan
 * Date: 28/12/2018
 * Time: 14:21
 */

namespace App\CSV_Export;


use App\LawChange;
use League\Csv\Reader;
use League\Csv\Writer;

class LawChangeCSV
{

    public static function exportLawChanges($lawChanges)
    {
        $columns = array('Änderungs_id','Gesetzes_id', 'User_id', 'Titel_neu', 'Gesetzestext_neu',
            'Begründung', 'Referenz','Änderungs_Bezugs_id', 'Datum');

        $callback = function() use ($lawChanges, $columns)
        {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($file, $columns,config('custom.delimiter'));

            foreach($lawChanges as $lawChange) {
                $referenz_string="Änderungsvorschlag";
                $begruendung_string=strip_tags($lawChange->begruendung);
                if ($lawChange->typ=='g') $referenz_string="Gesetz";
                if ($lawChange->geloescht==0)
                    fputcsv($file, array($lawChange->aenderungs_id,$lawChange->gesetzes_id, $lawChange->user_id,
                        $lawChange->titel_neu, $lawChange->gesetzestext_neu, $begruendung_string, $referenz_string,
                        $lawChange->aenderungs_bezugs_id, date('d.m.Y H:i:s',strtotime($lawChange->datum))),
                        config('custom.delimiter'));
            }
            fclose($file);
        };
        return $callback;
    }

    public static function exportLawChangesZip($lawChanges, $id, $typ)
    {
        $columns = array('Änderungs_id','Gesetzes_id', 'User_id', 'Titel_neu', 'Gesetzestext_neu',
            'Begründung', 'Referenz','Änderungs_Bezugs_id', 'Datum');
        $filename = "Paragraph" . $id . "_Änderungsvorschläge.csv";
        if ($typ == 'k')
            $filename = "Kommentar" . $id . "_Änderungsvorschläge.csv";
        elseif ($typ == 'v')
            $filename = "Änderungsvorschlag" . $id . "_Änderungsvorschläge.csv";
        $csv = Writer::createFromStream(fopen('php://temp', 'r+'));
        $csv->setDelimiter(config('custom.delimiter'));
        $csv->setOutputBOM(Reader::BOM_UTF8);
        $csv->insertOne($columns);

        foreach ($lawChanges as $lawChange) {
            $referenz_string="Änderungsvorschlag";
            $begruendung_string=strip_tags($lawChange->begruendung);
            if ($lawChange->typ=='g') $referenz_string="Gesetz";
            if ($lawChange->geloescht==0)
                $csv->insertOne(array($lawChange->aenderungs_id,$lawChange->gesetzes_id, $lawChange->user_id,
                    $lawChange->titel_neu, $lawChange->gesetzestext_neu, $begruendung_string, $referenz_string,
                    $lawChange->aenderungs_bezugs_id, date('d.m.Y H:i:s',strtotime($lawChange->datum))));
        }
        return ["filename" => $filename, "file" => $csv->getContent()];
    }

    public static function exportOne($id)
    {
        $lawChange = LawChange::find($id);
        $comments = $lawChange->directComments();
        $ratings = $lawChange->ratings();
        $lawChanges = $lawChange->directLawChanges();
        $tags = array();
        $references_tags = $lawChange->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($tags, $reference_tag->tag->tag);

        $linesCount = self::getLinesCount($lawChanges, $comments, $ratings, $tags);

        $columns = array('Änderungs_id', 'Gesetzes_id', 'User_id', 'Titel_neu', 'Gesetzestext_neu',
            'Begründung','Referenz','Änderungs_Bezugs_id', 'Datum', 'Änderungen_id', 'Kommentare_id', 'Ratings_id', 'Tags');

        $callback = function () use ($lawChange, $columns, $lawChanges, $comments, $ratings, $tags, $linesCount) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $columns, config('custom.delimiter'));
            for ($i = 0; $i < $linesCount; $i++) {
                fputcsv($file, self::createCSVArray($i, $lawChange, $lawChanges, $comments, $ratings, $tags), config('custom.delimiter'));
            }
            fclose($file);
        };
        return $callback;
    }

    /**
     * @param int $aenderungs_id
     * @param $id
     * @param string $typ
     * @return array
     * @throws \League\Csv\CannotInsertRecord
     * @throws \League\Csv\Exception
     */
    public static function exportOneAsReferenceZip(int $aenderungs_id, $id, string $typ)
    {
        $lawChange = LawChange::find($aenderungs_id);
        $comments = $lawChange->directComments();
        $ratings = $lawChange->ratings();
        $lawChanges = $lawChange->directLawChanges();
        $tags = array();
        $references_tags = $lawChange->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($tags, $reference_tag->tag->tag);

        $columns = array('Änderungs_id', 'Gesetzes_id', 'User_id', 'Titel_neu', 'Gesetzestext_neu',
            'Begründung','Referenz','Änderungs_Bezugs_id', 'Datum', 'Änderungen_id', 'Kommentare_id', 'Ratings_id', 'Tags');
        $filename = "";
        if ($typ == 'k')
            $filename = "Kommentar" . $id . "_Referenz_" . "Änderungsvorschlag" . $aenderungs_id . ".csv";
        if ($typ == 'v')
            $filename = "Änderungsvorschlag" . $id . "_Referenz_" . "Änderungsvorschlag" . $aenderungs_id . ".csv";
        $csv = Writer::createFromStream(fopen('php://temp', 'r+'));
        $csv->setDelimiter(config('custom.delimiter'));
        $csv->setOutputBOM(Reader::BOM_UTF8);
        $csv->insertOne($columns);

        $linesCount = self::getLinesCount($lawChanges, $comments, $ratings, $tags);

        for ($i = 0; $i < $linesCount; $i++) {
            $csv->insertOne(self::createCSVArray($i, $lawChange, $lawChanges, $comments, $ratings, $tags));
        }
        return ["filename" => $filename, "file" => $csv->getContent()];
    }

    public static function exportOneWithParams($id, array $params)
    {
        $lawChange = LawChange::find($id);
        $comments = $lawChange->directComments();
        $columns = $params;
        $ratings = $lawChange->ratings();
        $lawChanges = $lawChange->directLawChanges();
        $tags = array();
        $references_tags = $lawChange->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($tags, $reference_tag->tag->tag);
        $linesCount = self::getLinesCount($lawChanges, $comments, $ratings, $tags);

        $callback = function () use ($lawChange, $columns, $lawChanges, $comments, $ratings, $tags, $linesCount) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $columns, config('custom.delimiter'));

            for ($i = 0; $i < $linesCount; $i++) {
                $line = array();
                foreach ($columns as $column)
                    array_push($line, self::getColumnValue($i, $lawChange, $column, $lawChanges, $comments, $ratings, $tags));
                fputcsv($file, $line, config('custom.delimiter'));
            }
        };
        return $callback;
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
        $lawChange = LawChange::find($id);
        $comments = $lawChange->directComments();
        $columns = $params;
        $ratings = $lawChange->ratings();
        $lawChanges = $lawChange->directLawChanges();
        $tags = array();
        $references_tags = $lawChange->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($tags, $reference_tag->tag->tag);
        $filename = 'Änderungsvorschlag' . $lawChange->aenderungs_id . ".csv";
        $csv = Writer::createFromStream(fopen('php://temp', 'r+'));
        $csv->setOutputBOM(Reader::BOM_UTF8);
        $csv->setDelimiter(config('custom.delimiter'));
        $csv->insertOne($columns);
        $linesCount = self::getLinesCount($lawChanges, $comments, $ratings, $tags);

        for ($i = 0; $i < $linesCount; $i++) {
            $line = array();
            foreach ($columns as $column)
                array_push($line, self::getColumnValue($i, $lawChange, $column, $lawChanges, $comments, $ratings, $tags));
            $csv->insertOne($line);
        }
        return ["filename" => $filename, "file" => $csv->getContent()];
    }

    public static function createCSVArray(int $i, LawChange $lawChange, $lawChanges, $comments, $ratings, $tags)
    {
        $returnArray = array();
        if ($i == 0) {
            array_push($returnArray, $lawChange->aenderungs_id);
            array_push($returnArray, $lawChange->gesetzes_id);
            array_push($returnArray, $lawChange->user_id);
            array_push($returnArray, $lawChange->titel_neu);
            array_push($returnArray, $lawChange->gesetzestext_neu);
            array_push($returnArray, html_entity_decode(strip_tags($lawChange->begruendung)));
            if ($lawChange->typ == "g")
                array_push($returnArray,"Gesetz");
            else
                array_push($returnArray,"Änderungsvorschlag");
            array_push($returnArray, $lawChange->aenderungs_bezugs_id);
            array_push($returnArray, date('d.m.Y H:i:s', strtotime($lawChange->datum)));
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
        } else {
            array_push($returnArray, "");
            array_push($returnArray, "");
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



    private static function getColumnValue(int $i, LawChange $lawChange, $column, $lawChanges, $comments, $ratings, $tags)
    {
        if ($column == "Änderungs_id") {
            if ($i == 0)
                return $lawChange->aenderungs_id;
            return "";
        }
        if ($column == "Gesetzes_id") {
            if ($i == 0)
                return $lawChange->gesetzes_id;
            return "";
        }
        if ($column == "User_id") {
            if ($i == 0)
                return $lawChange->user_id;
            return "";
        }
        if ($column == "Titel_neu") {
            if ($i == 0)
                return $lawChange->titel_neu;
            return "";
        }
        if ($column == "Gesetzestext_neu") {
            if ($i == 0)
                return $lawChange->gesetzestext_neu;
            return "";
        }
        if ($column == "Begründung") {
            if ($i == 0)
                return html_entity_decode(strip_tags($lawChange->begruendung));
            return "";
        }
        if ($column == "Referenz") {
            if ($i == 0) {
                if ($lawChange->typ == "g")
                    return "Gesetz";
                else
                    return "Änderungsvorschlag";
            }
            return "";
        }
        if ($column == "Änderungs_Bezugs_id") {
            if ($i == 0)
                return $lawChange->aenderungs_bezugs_id;
            return "";
        }
        if ($column == "Datum") {
            if ($i == 0 AND $lawChange->datum != null)
                return date('d.m.Y H:i:s', strtotime($lawChange->datum));
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
        return "error";
    }
}