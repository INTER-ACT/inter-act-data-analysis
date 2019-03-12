<?php

namespace App\Http\Controllers;

use App\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $settings=Setting::all();
        $header = array(
            "Access-Control-Allow-Origin"=>"*"
        );
        return response()->json($settings,200,$header);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $setting=Setting::find($id);
        return response()->json($setting,200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(Request $request)
    {
        $this->validate($request, [
            'einstellung_id' => 'required',
            'wert' => 'required'
        ]);

        $setting = Setting::findOrFail($request->einstellung_id);

        $setting->wert = $request->input('wert');

        $header = array(
            "Access-Control-Allow-Origin"=>"*"
        );

        if($setting->save()) {
            return response()->json([],204,$header);
        }
        return response(["msg"=>"An error occured"],404,$header);
    }


}
