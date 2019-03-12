<?php

namespace App\Http\Controllers;

use App\CSV_Export\CommentCSV;
use App\CSV_Export\LawChangeCSV;
use App\CSV_Export\LawCSV;
use App\CSV_Export\RatingCSV;
use App\Law;
use App\LawChange;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use ZipStream\ZipStream;

class LawChangeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $lawChanges=LawChange::all();
        foreach ($lawChanges as $lawChange){
            if (!$request->has('konversation'))
            $lawChange["conversationRate"]=$lawChange->OwnConversationRate();
            $lawChange["paragraph"]=Law::find($lawChange->gesetzes_id)->paragraph;
            $lawChange["sort"]=Law::find($lawChange->gesetzes_id)->sort;
            if ($request->has('konversation')){
                $comments_id=collect();
                foreach ($lawChange->directComments() as $comment)
                    $comments_id->push($comment->kommentar_id);
                $ratings_id=collect();
                foreach ($lawChange->ratings() as $rating)
                    $ratings_id->push($rating->rating_id);
                $lawChanges_id=collect();
                foreach ($lawChange->directLawChanges() as $lawChange_item)
                    $lawChanges_id->push($lawChange_item->aenderungs_id);
                $lawChange["aenderungen_id"]=$lawChanges_id;
                $lawChange["kommentare_id"]=$comments_id;
                $lawChange["ratings_id"]=$ratings_id;
            }
        }
        $header = array(
            "Access-Control-Allow-Origin"=>"*"
        );
        return response()->json($lawChanges,200,$header);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $lawChange=LawChange::find($id);
        $lawChange["conversationRate"]=$lawChange->OwnConversationRate();
        $comments_id=collect();
        foreach ($lawChange->directComments() as $comment)
            $comments_id->push($comment->kommentar_id);
        $ratings_id=collect();
        foreach ($lawChange->ratings() as $rating)
            $ratings_id->push($rating->rating_id);
        $lawChanges_id=collect();
        foreach ($lawChange->directLawChanges() as $lawChange_item)
            $lawChanges_id->push($lawChange_item->aenderungs_id);
        $tags = array();
        $references_tags = $lawChange->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($tags, $reference_tag->tag->tag);
        $lawChange["aenderungen_id"]=$lawChanges_id;
        $lawChange["kommentare_id"]=$comments_id;
        $lawChange["ratings_id"]=$ratings_id;
        $lawChange["tags"]=$tags;
        $header = array(
            "Access-Control-Allow-Origin" => "*"
        );
        return response()->json($lawChange,200,$header);
    }
    public function showLawChanges($id){
        $lawChanges=LawChange::find($id)->allLawChanges();
        return response()->json($lawChanges,200);
    }
    public function showRatings($id){
        $ratings=LawChange::find($id)->ratings();
        return response()->json($ratings,200);
    }
    public function showComments($id){
        $comments=LawChange::find($id)->allComments();
        return response()->json($comments,200);
    }

    public function export(){
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Änderungsvorschläge.csv",
            "Access-Control-Allow-Origin"=>"*",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );

        $lawChanges = LawChange::all();
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
        return Response::stream($callback, 200, $headers);
    }

    public function exportLawChanges($id, Request $request)
    {
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Änderungsvorschlag" . $id . "_Änderungsvorschläge.csv",
            "Access-Control-Allow-Origin" => "*",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );
        $lawChange = LawChange::find($id);
        $lawChanges = $lawChange->allLawChanges();
        if ($request->has('direkte'))
            $lawChanges = $lawChange->directLawChanges();
        $callback = LawChangeCSV::exportLawChanges($lawChanges);
        return Response::stream($callback, 200, $headers);
    }

    public function exportComments($id, Request $request)
    {
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Änderungsvorschlag" . $id . "_Kommentare.csv",
            "Access-Control-Allow-Origin" => "*",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );
        $lawChange = LawChange::find($id);
        $comments=collect();
        if (!$request->has("nur-aenderungen"))
            $comments = $lawChange->allComments();
        if ($request->has('alle')) {
            $lawChanges = $lawChange->allLawChanges();
            foreach ($lawChanges as $lawChange_item)
                foreach ($lawChange_item->allComments() as $comment)
                    $comments->push($comment);
        } elseif ($request->has('direkte')) {
            $lawChanges = $lawChange->directLawChanges();
            foreach ($lawChanges as $lawChange_item)
                foreach ($lawChange_item->allComments() as $comment)
                    $comments->push($comment);
        }
        $callback = CommentCSV::exportComments($comments);
        return Response::stream($callback, 200, $headers);
    }

    public function exportRatings($id, Request $request)
    {
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Änderungsvorschlag" . $id . "_Ratings.csv",
            "Access-Control-Allow-Origin" => "*",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );
        $lawChange = LawChange::find($id);
        $ratings=collect();
        if (!$request->has("nur-aenderungen"))
            $ratings = $lawChange->ratings();
        if ($request->has('alle')) {
            $lawChanges = $lawChange->allLawChanges();
            foreach ($lawChanges as $lawChange_item)
                foreach ($lawChange_item->ratings() as $rating)
                    $ratings->push($rating);
        } elseif ($request->has('direkte')) {
            $lawChanges = $lawChange->directLawChanges();
            foreach ($lawChanges as $lawChange_item)
                foreach ($lawChange_item->ratings() as $rating)
                    $ratings->push($rating);
        }
        $callback = RatingCSV::exportRatings($ratings);
        return Response::stream($callback, 200, $headers);
    }
    public function exportReference($id){
        $lawChange=LawChange::find($id);
        $reference=$lawChange->reference();
        $csvName="";
        $callback=null;
        if ($reference[0] instanceof LawChange) {
            $callback = LawChangeCSV::exportOne($reference[0]->aenderungs_id);
            $csvName="Änderungsvorschlag".$id."_Referenz_"."Änderungsvorschlag".$reference[0]->aenderungs_id;
        }
        else{
            $callback=LawCSV::exportOne($reference[0]->gesetzes_id);
            $csvName="Änderungsvorschlag".$id."_Referenz_"."Paragraph".$reference[0]->gesetzes_id;
        }
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=".$csvName.".csv",
            "Pragma" => "no-cache",
            "Access-Control-Allow-Origin"=>"*",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );
        return Response::stream($callback, 200, $headers);
    }

    public function exportReferenceLaw($id){
        $lawChange=LawChange::find($id);
        $callback=LawCSV::exportOne($lawChange->gesetzes_id);
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Änderungsvorschlag".$lawChange->aenderungs_id."_Paragraph".$lawChange->gesetzes_id.".csv",
            "Pragma" => "no-cache",
            "Access-Control-Allow-Origin"=>"*",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );
        return Response::stream($callback, 200, $headers);
    }

    public function exportOne($id, Request $request)
    {
        $lawChange=LawChange::find($id);
        $zipname = "Änderungsvorschlag" . $id . ".zip";
        $reference=$lawChange->reference();
        $params = array();
        if ($request->has("aenderungsid"))
            array_push($params, "Änderungs_id");
        if ($request->has("gesetzesid"))
            array_push($params, "Gesetzes_id");
        if ($request->has("userid"))
            array_push($params, "User_id");
        if ($request->has("titel_neu"))
            array_push($params, "Titel_neu");
        if ($request->has("gesetzestext_neu"))
            array_push($params, "Gesetzestext_neu");
        if ($request->has("begruendung"))
            array_push($params, "Begründung");
        if ($request->has("referenz"))
            array_push($params, "Referenz");
        if ($request->has("aenderungs_bezugs_id"))
            array_push($params, "Änderungs_Bezugs_id");
        if ($request->has("datum"))
            array_push($params, "Datum");
        if ($request->has("aenderungenid"))
            array_push($params, "Änderungen_id");
        if ($request->has("kommentareid"))
            array_push($params, "Kommentare_id");
        if ($request->has("ratingsid"))
            array_push($params, "Ratings_id");
        if ($request->has("tags"))
            array_push($params, "Tags");
        if (!$request->has('kommentare')
            AND !$request->has('ratings')
            AND !$request->has('aenderungen_ratings')
            AND !$request->has('aenderungen_kommentare')
            AND !$request->has('aenderungen')
            AND !$request->has('bezugs_element')
            AND !empty($params)) {
            $callback = LawChangeCSV::exportOneWithParams($id, $params);
            $headers = array(
                "Content-type" => "text/csv",
                "Content-Disposition" => "attachment; filename=Änderungsvorschlag" . $id . ".csv",
                "Pragma" => "no-cache",
                "Access-Control-Allow-Origin" => "*",
                "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
                "Expires" => "0"
            );
            return Response::stream($callback, 200, $headers);
        }
        if (empty($params))
            return response([],404);
        $headersZip = array(
            "Content-type" => 'application/octet-stream',
            "Content-Disposition" => "attachment; filename=" . $zipname,
            "Access-Control-Allow-Origin" => "*"
        );
        return response()->stream(function () use ($id, $params, $request,$reference, $zipname) {
            $files = array();
            $zip = new ZipStream($zipname, ['content_type' => 'application/octet-stream']);
            $lawChange = LawChange::find($id);
            $comments = collect();
            $ratings = collect();
            $lawChanges = collect();
            if (!empty($params))
                array_push($files, LawChangeCSV::exportOneWithParamsZip($id, $params));
            if ($request->has('aenderungen')) {
                if ($request->get('aenderungen') == 'direkte')
                    foreach ($lawChange->directLawChanges() as $lawChange_item)
                        $lawChanges->push($lawChange_item);
                else
                    foreach ($lawChange->allLawChanges() as $lawChange_item)
                        $lawChanges->push($lawChange_item);
                array_push($files, LawChangeCSV::exportLawChangesZip($lawChanges, $id, 'v'));
            }
            if ($request->has('kommentare'))
                foreach ($lawChange->allComments() as $comment)
                    $comments->push($comment);
            if ($request->has('ratings'))
                foreach ($lawChange->ratings() as $rating)
                    $ratings->push($rating);
            if ($request->has('aenderungen_kommentare'))
                foreach ($lawChanges as $lawChange_item)
                    foreach ($lawChange_item->allComments() as $comment)
                        $comments->push($comment);
            if ($request->has('aenderungen_ratings'))
                foreach ($lawChanges as $lawChange_item)
                    foreach ($lawChange_item->ratings() as $rating)
                        $ratings->push($rating);

            if ($request->has('kommentare') OR $request->has('aenderungen_kommentare'))
                array_push($files, CommentCSV::exportCommentsZip($comments, $id, 'v'));
            if ($request->has('ratings') OR $request->has('aenderungen_ratings'))
                array_push($files, RatingCSV::exportRatingsZip($ratings, $id, 'v'));
            if ($request->has('bezugs_element')) {
                if ($reference[0] instanceof LawChange)
                    array_push($files,LawChangeCSV::exportOneAsReferenceZip($reference[0]->aenderungs_id,$id,'v'));
                elseif($reference[0] instanceof Law)
                    array_push($files,LawCSV::exportOneAsReferenceZip($reference[0]->gesetzes_id,$id,'v'));
            }

            foreach ($files as $filename => $file)
                $zip->addFile($file["filename"], $file["file"]);

            $zip->finish();
        }, 200, $headersZip);
    }
}
