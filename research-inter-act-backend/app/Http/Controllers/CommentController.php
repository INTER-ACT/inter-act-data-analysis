<?php

namespace App\Http\Controllers;

use App\Comment;
use App\CSV_Export\LawChangeCSV;
use App\CSV_Export\LawCSV;
use App\Law;
use App\LawChange;
use DirectoryIterator;
use function foo\func;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use ZipStream\ZipStream;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $comments=Comment::all();
        foreach ($comments as $comment){
            $comment["kommentare_likes"]=$comment->comments_likes();
        }
        $header = array(
            "Access-Control-Allow-Origin"=>"*"
        );
        return response($comments,200,$header);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $comment=Comment::find($id);
        $temp_comments = $comment->allComments();
        $temp_comments_id=array();
        foreach ($temp_comments as $temp_comment)
            array_push($temp_comments_id,$temp_comment->kommentar_id);
        $temp_tags = array();
        $references_tags = $comment->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($temp_tags, $reference_tag->tag->tag);
        $comment["kommentare_id"]=$temp_comments_id;
        $comment["tags"]=$temp_tags;
        $comment["kommentare_likes"]=$comment->comments_likes();
        $header = array(
            "Access-Control-Allow-Origin"=>"*"
        );
        return response($comment,200,$header);
    }

    public function export(){
        $callback=Comment::export(0);
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Kommentare.csv",
            "Access-Control-Allow-Origin"=>"*",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );

        return Response::stream($callback, 200, $headers);
    }


    public function exportComments($id){
        $callback=Comment::export($id);
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Kommentar".$id."_Kommentare.csv",
            "Pragma" => "no-cache",
            "Access-Control-Allow-Origin"=>"*",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );

        return Response::stream($callback, 200, $headers);
    }

    public function exportReference($id){
        $comment=Comment::find($id);
        $reference=$comment->reference();
        $csvName="";
        $callback=null;
        if ($reference[0] instanceof Comment) {
            $callback = Comment::exportOne($reference[0]->kommentar_id,$comment->kommentar_id);
            $csvName="Kommentar".$id."_Referenz_"."Kommentar".$reference[0]->kommentar_id;
        }
        else if ($reference[0] instanceof LawChange) {
            $callback = LawChangeCSV::exportOne($reference[0]->aenderungs_id);
            $csvName="Kommentar".$id."_Referenz_"."Änderungsvorschlag".$reference[0]->aenderungs_id;
        }
        else if ($reference[0] instanceof Law){
            $callback=LawCSV::exportOne($reference[0]->gesetzes_id);
            $csvName="Kommentar".$id."_Referenz_"."Paragraph".$reference[0]->gesetzes_id;
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

    //https://stackoverflow.com/questions/27707620/php-create-multiple-csv-files-in-memory-then-compress
    public function exportOne($id,Request $request){
        $comment=Comment::find($id);
        $reference=$comment->reference();
        $zipname="Kommentar".$id.".zip";
        $params=array();
        if ($request->has("kommentarid"))
            array_push($params, "Kommentar_id");
        if ($request->has("userid"))
            array_push($params, "User_id");
        if ($request->has("referenz"))
            array_push($params, "Referenz");
        if ($request->has("kommentar_bezugs_id"))
            array_push($params, "Kommentar_Bezugs_id");
        if ($request->has("kommentar"))
            array_push($params, "Kommentar");
        if ($request->has("likes"))
            array_push($params, "Likes");
        if ($request->has("datum"))
            array_push($params, "Datum");
        if ($request->has("kommentareid"))
            array_push($params, "Kommentare_id");
        if ($request->has("tags"))
            array_push($params, "Tags");
        if (!$request->has('kommentare')AND!$request->has('bezugs_element')AND!empty($params)){
            $callback=Comment::exportOneWithParams($id,$params);
            $headers = array(
                "Content-type" => "text/csv",
                "Content-Disposition" => "attachment; filename=Kommentar".$id.".csv",
                "Pragma" => "no-cache",
                "Access-Control-Allow-Origin"=>"*",
                "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
                "Expires" => "0"
            );
            return Response::stream($callback, 200, $headers);
        }
        if (empty($params))
            return response([],404);
        $headersZip = array(
            "Content-type" => 'application/octet-stream',
            "Content-Disposition" => "attachment; filename=Kommentar".$id.".zip",
            "Access-Control-Allow-Origin"=>"*"
        );
        return response()->stream(function () use ($id,$params,$request,$reference,$zipname) {
            $files=array();
            $zip=new ZipStream($zipname,['content_type' => 'application/octet-stream']);
            if (!empty($params))
                array_push($files,Comment::exportOneWithParamsZip($id, $params));
            if ($request->has('kommentare'))
                array_push($files,Comment::exportZip($id));
            if ($request->has('bezugs_element')) {
                if($reference[0] instanceof Comment)
                array_push($files, Comment::exportOneAsReferenceZip($reference[0]->kommentar_id, $id));
                if ($reference[0] instanceof LawChange)
                    array_push($files,LawChangeCSV::exportOneAsReferenceZip($reference[0]->aenderungs_id,$id,'k'));
                elseif ($reference[0] instanceof Law)
                    array_push($files,LawCSV::exportOneAsReferenceZip($reference[0]->gesetzes_id,$id,'k'));
            }
            foreach ($files as $filename => $file)
                $zip->addFile($file["filename"],$file["file"]);

            $zip->finish();
    },200,$headersZip);
    }




}
