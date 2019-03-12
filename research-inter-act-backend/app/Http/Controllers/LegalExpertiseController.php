<?php

namespace App\Http\Controllers;

use App\LegalExpertise;
use Illuminate\Http\Request;

class LegalExpertiseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $legalExpertises=LegalExpertise::all();
        $header = array(
            "Access-Control-Allow-Origin"=>"*"
        );
        return response()->json($legalExpertises, 200,$header);
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\LegalExpertise  $legalExpertise
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $legalExpertise=LegalExpertise::find($id);
        return response()->json($legalExpertise,200);
    }

}
