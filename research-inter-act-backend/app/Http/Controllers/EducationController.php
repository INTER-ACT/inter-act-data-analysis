<?php

namespace App\Http\Controllers;

use App\Education;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $educations=Education::all();
        $header = array(
            "Access-Control-Allow-Origin"=>"*"
        );
        return response()->json($educations,200,$header);
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Education  $education
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $education=Education::find($id);
        return response()->json($education,200);
    }

}
