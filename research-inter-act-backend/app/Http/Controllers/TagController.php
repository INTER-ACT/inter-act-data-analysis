<?php

namespace App\Http\Controllers;

use App\References_Tags;
use App\Tag;
use App\ReferencesTags;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tags=References_Tags::all();
        return response()->json($tags,200);
    }


    public function showByComment($tag_id,$bezugs_id)
    {
        $tag=References_Tags::all()->where('bezugs_id',$bezugs_id)->where('tag_id',$tag_id)->where('typ','k');
        return response()->json($tag,200);
    }
    public function showByLaw($tag_id,$bezugs_id)
    {
        $tag=References_Tags::all()->where('bezugs_id',$bezugs_id)->where('tag_id',$tag_id)->where('typ','g');
        return response()->json($tag,200);
    }
    public function showByLawChange($tag_id,$bezugs_id)
    {
        $tag=References_Tags::all()->where('bezugs_id',$bezugs_id)->where('tag_id',$tag_id)->where('typ','v');
        return response()->json($tag,200);
    }

    public function export(){
        ini_set('max_execution_time', 1000);
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Tags.csv",
            "Access-Control-Allow-Origin"=>"*",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );

        $tags = References_Tags::all();
        $columns = array('Bezugs_id','Referenz', 'Tag');

        $callback = function() use ($tags, $columns)
        {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($file, $columns,config('custom.delimiter'));

            foreach($tags as $tag) {
                $referenz_string="Änderungsvorschlag";
                if ($tag->typ=='g')$referenz_string="Paragraph";
                elseif ($tag->typ=='k')$referenz_string="Kommentar";
                $tag_object=Tag::with('references_tags')->where('tag_id',$tag->tag_id)->get();

                    fputcsv($file, array($tag->bezugs_id,$referenz_string,$tag_object[0]->tag),
                        config('custom.delimiter'));
            }
            fclose($file);
        };
        return Response::stream($callback, 200, $headers);
    }
}
