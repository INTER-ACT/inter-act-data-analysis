<?php

namespace App\Http\Controllers;

use App\CSV_Export\CommentCSV;
use App\CSV_Export\LawChangeCSV;
use App\CSV_Export\LawCSV;
use App\CSV_Export\RatingCSV;
use App\Law;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use ZipStream\ZipStream;

class LawController extends Controller
{
    public function index(Request $request)
    {
        $laws = Law::all()->where('originaltext',true);
        foreach ($laws as $law) {
            if (!$request->has('konversation')){
            $law["conversationRate"] = $law->conversationRate();
            $law["ratingsRate"] = $law->ratingsRate();}
            if($request->has('konversation')) {
                $comments_id = collect();
                foreach ($law->directComments() as $comment)
                    $comments_id->push($comment->kommentar_id);
                $ratings_id = collect();
                foreach ($law->ratings() as $rating)
                    $ratings_id->push($rating->rating_id);
                $lawChanges_id = collect();
                foreach ($law->directLawChanges() as $lawChange)
                    $lawChanges_id->push($lawChange->aenderungs_id);
                $law["aenderungen_id"] = $lawChanges_id;
                $law["kommentare_id"] = $comments_id;
                $law["ratings_id"] = $ratings_id;
            }
        }
        $header = array(
            "Access-Control-Allow-Origin" => "*"
        );
        return response()->json($laws, 200, $header);
    }

    public function show($id)
    {
        $law = Law::find($id);
        $law["ConversationRate"] = $law->conversationRate();
        $law["ratingsRate"] = $law->ratingsRate();

        $comments_id=collect();
        foreach ($law->directComments() as $comment)
            $comments_id->push($comment->kommentar_id);
        $ratings_id=collect();
        foreach ($law->ratings() as $rating)
            $ratings_id->push($rating->rating_id);
        $lawChanges_id=collect();
        foreach ($law->directLawChanges() as $lawChange)
            $lawChanges_id->push($lawChange->aenderungs_id);
        $tags = array();
        $references_tags = $law->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($tags, $reference_tag->tag->tag);
        $law["aenderungen_id"]=$lawChanges_id;
        $law["kommentare_id"]=$comments_id;
        $law["ratings_id"]=$ratings_id;
        $law["tags"]=$tags;
        $header = array(
            "Access-Control-Allow-Origin" => "*"
        );
        return response()->json($law, 200, $header);
    }

    public function showComments($id)
    {
        $comments = Law::find($id)->allComments();
        return response()->json($comments, 200);
    }

    public function showLawChanges($id)
    {
        $lawChanges = Law::find($id)->allLawChanges();
        return response()->json($lawChanges, 200);
    }

    public function showRatings($id)
    {
        $ratings = Law::find($id)->ratings();
        return response()->json($ratings, 200);
    }

    public function showStatistics($id)
    {
        $statistics = Law::find($id)->statistics();
        return response()->json($statistics, 200);
    }

    public function export()
    {
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Paragraphendiskussionen.csv",
            "Pragma" => "no-cache",
            "Access-Control-Allow-Origin" => "*",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );

        $callback=LawCSV::exportAll();
        return Response::stream($callback, 200, $headers);
    }

    public function exportLawChanges($id, Request $request)
    {
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Paragraph" . $id . "_Änderungsvorschläge.csv",
            "Access-Control-Allow-Origin" => "*",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );
        $law = Law::find($id);
        $lawChanges = $law->allLawChanges();
        if ($request->has('direkte'))
            $lawChanges = $law->directLawChanges();
        $callback = LawChangeCSV::exportLawChanges($lawChanges);
        return Response::stream($callback, 200, $headers);
    }

    public function exportComments($id, Request $request)
    {
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Paragraph" . $id . "_Kommentare.csv",
            "Access-Control-Allow-Origin" => "*",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );
        $law = Law::find($id);
        $comments=collect();
        if (!$request->has("nur-aenderungen"))
        $comments = $law->allComments();
        if ($request->has('alle')) {
            $lawChanges = $law->allLawChanges();
            foreach ($lawChanges as $lawChange)
                foreach ($lawChange->allComments() as $comment)
                    $comments->push($comment);
        } elseif ($request->has('direkte')) {
            $lawChanges = $law->directLawChanges();
            foreach ($lawChanges as $lawChange)
                foreach ($lawChange->allComments() as $comment)
                    $comments->push($comment);
        }
        $callback = CommentCSV::exportComments($comments);
        return Response::stream($callback, 200, $headers);
    }

    public function exportRatings($id, Request $request)
    {
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Paragraph" . $id . "_Ratings.csv",
            "Access-Control-Allow-Origin" => "*",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );
        $law = Law::find($id);
        $ratings=collect();
        if (!$request->has("nur-aenderungen"))
        $ratings = $law->ratings();
        if ($request->has('alle')) {
            $lawChanges = $law->allLawChanges();
            foreach ($lawChanges as $lawChange)
                foreach ($lawChange->ratings() as $rating)
                    $ratings->push($rating);
        } elseif ($request->has('direkte')) {
            $lawChanges = $law->directLawChanges();
            foreach ($lawChanges as $lawChange)
                foreach ($lawChange->ratings() as $rating)
                    $ratings->push($rating);
        }
        $callback = RatingCSV::exportRatings($ratings);
        return Response::stream($callback, 200, $headers);
    }

    public function exportOne($id, Request $request)
    {
        $zipname = "Paragraph" . $id . ".zip";
        $params = array();
        if ($request->has("gesetzesid"))
            array_push($params, "Gesetzes_id");
        if ($request->has("gesetz"))
            array_push($params, "Gesetz");
        if ($request->has("paragraph"))
            array_push($params, "Paragraph");
        if ($request->has("titel"))
            array_push($params, "Titel");
        if ($request->has("gesetzestext"))
            array_push($params, "Gesetzestext");
        if ($request->has("erklaerung"))
            array_push($params, "Erklärung");
        if ($request->has("bgbl"))
            array_push($params, "Bundesgesetzblatt");
        if ($request->has("aenderungenid"))
            array_push($params, "Änderungen_id");
        if ($request->has("kommentareid"))
            array_push($params, "Kommentare_id");
        if ($request->has("ratingsid"))
            array_push($params, "Ratings_id");
        if ($request->has("tags"))
            array_push($params, "Tags");
        if ($request->has("originaltext"))
            array_push($params, "Originaltext");
        if ($request->has("datum"))
            array_push($params, "Datum");
        if ($request->has("userid"))
            array_push($params, "User_id");
        if (!$request->has('kommentare')
            AND !$request->has('ratings')
            AND !$request->has('aenderungen_ratings')
            AND !$request->has('aenderungen_kommentare')
            AND !$request->has('aenderungen')
            AND !empty($params)) {
            $callback = LawCSV::exportOneWithParams($id, $params);
            $headers = array(
                "Content-type" => "text/csv",
                "Content-Disposition" => "attachment; filename=Paragraph" . $id . ".csv",
                "Pragma" => "no-cache",
                "Access-Control-Allow-Origin" => "*",
                "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
                "Expires" => "0"
            );
            return Response::stream($callback, 200, $headers);
        }
        if (empty($params)){
            return response([],404);
        }
        $headersZip = array(
            "Content-type" => 'application/octet-stream',
            "Content-Disposition" => "attachment; filename=" . $zipname,
            "Access-Control-Allow-Origin" => "*"
        );
        return response()->stream(function () use ($id, $params, $request, $zipname) {
            $files = array();
            $zip = new ZipStream($zipname, ['content_type' => 'application/octet-stream']);
            $law = Law::find($id);
            $comments = collect();
            $ratings = collect();
            $lawChanges = collect();
            if (!empty($params))
                array_push($files, LawCSV::exportOneWithParamsZip($id, $params));
            if ($request->has('aenderungen')) {
                if ($request->get('aenderungen') == 'direkte')
                    foreach ($law->directLawChanges() as $lawChange)
                        $lawChanges->push($lawChange);
                else
                    foreach ($law->allLawChanges() as $lawChange)
                        $lawChanges->push($lawChange);
                array_push($files, LawChangeCSV::exportLawChangesZip($lawChanges, $id, 'g'));
            }
            if ($request->has('kommentare'))
                foreach ($law->allComments() as $comment)
                    $comments->push($comment);
            if ($request->has('ratings'))
                foreach ($law->ratings() as $rating)
                    $ratings->push($rating);
            if ($request->has('aenderungen_kommentare'))
                foreach ($lawChanges as $lawChange)
                    foreach ($lawChange->allComments() as $comment)
                        $comments->push($comment);
            if ($request->has('aenderungen_ratings'))
                foreach ($lawChanges as $lawChange)
                    foreach ($lawChange->ratings() as $rating)
                        $ratings->push($rating);

            if ($request->has('kommentare') OR $request->has('aenderungen_kommentare'))
                array_push($files, CommentCSV::exportCommentsZip($comments, $id, 'g'));
            if ($request->has('ratings') OR $request->has('aenderungen_ratings'))
                array_push($files, RatingCSV::exportRatingsZip($ratings, $id, 'g'));

            foreach ($files as $filename => $file)
                $zip->addFile($file["filename"], $file["file"]);

            $zip->finish();
        }, 200, $headersZip);
    }

    public function consolidated()
    {
        $laws=Law::showLawsConsolidated();

        $header = array(
            "Access-Control-Allow-Origin" => "*"
        );
        return response()->json($laws, 200, $header);
    }

    public function consolidatedHtml(){
        $laws=Law::showLawsConsolidated();
        $response = Response::make(view("consolidated_laws",['laws'=>$laws])->render(), 200);
        return $response;
    }

}
