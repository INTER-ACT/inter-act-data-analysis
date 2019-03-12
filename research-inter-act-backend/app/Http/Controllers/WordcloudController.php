<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Law;


class WordcloudController extends Controller
{
    public function show(){
        $laws=Law::getLaws();
        $response = Response::make(view("wordcloud",['laws'=>$laws])->render(), 200);
        return $response;
    }
}
