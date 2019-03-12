<?php

namespace App\Http\Controllers;

use App\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class RatingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $ratings=Rating::all();
        $header = array(
            "Access-Control-Allow-Origin"=>"*"
        );
        return response($ratings,200,$header);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $rating=Rating::find($id);
        return response()->json($rating,200);
    }


    public function export(){
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Ratings.csv",
            "Access-Control-Allow-Origin"=>"*",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );

        $ratings = Rating::all();
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

                    fputcsv($file, array($rating->rating_id,$rating->user_id, $referenz_string,
                        $aspekt_string, $rating->wertung, $rating->rating_bezugs_id,
                        date('d.m.Y H:i:s',strtotime($rating->datum))),config('custom.delimiter'));
            }
            fclose($file);
        };
        return Response::stream($callback, 200, $headers);
    }
}
