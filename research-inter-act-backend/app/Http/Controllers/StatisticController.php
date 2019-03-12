<?php

namespace App\Http\Controllers;

use App\Statistic;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StatisticController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $statistics=Statistic::all();
        $header = array(
            "Access-Control-Allow-Origin"=>"*"
        );
        return response()->json($statistics,200,$header);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $statistic=Statistic::find($id);
        return response()->json($statistic,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'gesetzes_id' => 'required',
        ]);

        $statistic = new Statistic();

        $statistic->gesetzes_id = $request->input('gesetzes_id');
        if ($request->has('user_id'))
        $statistic->user_id = $request->input('user_id');
        if ($request->has('link_ort'))
            $statistic->link_ort = $request->input('link_ort');
        $statistic->datum=Carbon::now();

        $header = array(
            "Access-Control-Allow-Origin"=>"*"
        );
        if($statistic->save()) {
            return response()->json([],201,$header);
        }
        return response(["msg"=>"An error occured"],404,$header);
    }

}
