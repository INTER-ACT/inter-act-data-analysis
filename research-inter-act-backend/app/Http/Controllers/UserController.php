<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Comments_Likes;
use App\Education;
use App\Law;
use App\LawChange;
use App\LegalExpertise;
use App\Rating;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $users = User::all();

        if ($request->has('aktivitaeten')){
            foreach ($users as $user) {
                $activities=array();
                foreach (Comment::all()->where('user_id',$user->user_id) as $comment)
                    array_push($activities,['aktivitaet'=>'comment','datum'=>$comment->datum]);
                foreach (LawChange::all()->where('user_id',$user->user_id) as $lawChange)
                    array_push($activities,['aktivitaet'=>'lawChange','datum'=>$lawChange->datum]);
                foreach (Comments_Likes::all()->where('user_id',$user->user_id) as $comment_like)
                    array_push($activities,['aktivitaet'=>'comment_like','datum'=>$comment_like->datum]);
                foreach (Rating::all()->where('user_id',$user->user_id) as $rating)
                    array_push($activities,['aktivitaet'=>'rating','datum'=>$rating->datum]);

                usort($activities, function($a, $b) {
                    return ($a['datum'] < $b['datum']) ? -1 : 1;
                });
                $user['aktivitaeten']=$activities;
            }
        }

        $header = array(
            "Access-Control-Allow-Origin"=>"*"
        );
        return response()->json($users, 200,$header);
    }


    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::find($id);
        return response()->json($user, 200);
    }

    public function export()
    {
        $headers = array(
            "Content-type" => "text/csv",
            "Access-Control-Allow-Origin" => "*",
            "Content-Disposition" => "attachment; filename=Users.csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );

        $users = User::all();
        $columns = array('User_id', 'Username', 'Geschlecht', 'Postleitzahl', 'Ort',
            'Beruf', 'Geburtsjahr', 'Rechtskenntnisse', 'Education');

        $callback = function () use ($users, $columns) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $columns, config('custom.delimiter'));

            foreach ($users as $user) {
                $geschlecht_string = "männlich";
                $ausbildung = Education::with('users')->where('ausbildungs_id', $user->ausbildung)->get();
                $rechtskenntniss = LegalExpertise::with('users')->where('rechtskenntnis_id', $user->rechtskenntnisse)->get();
                if ($user->is_male == false) $geschlecht_string = "weiblich";

                if ($user->geloescht == false AND $user->aktiv == true AND $user->gesperrt == false)
                    fputcsv($file, array($user->user_id, $user->username, $geschlecht_string,
                        $user->plz, $user->ort, $user->beruf, $user->geb_jahr,
                        $ausbildung[0]->ausbildung,
                        $rechtskenntniss[0]->rechtskenntnis),
                        config('custom.delimiter'));
            }
            fclose($file);
        };
        return Response::stream($callback, 200, $headers);
    }

    public function showLawsConsolidated($id)
    {
        $laws=User::showLawsConsolidated($id);

        $header = array(
            "Access-Control-Allow-Origin" => "*"
        );
        return response()->json($laws, 200, $header);
    }

    public function showLawsConsolidatedHtml($id){
        $laws=User::showLawsConsolidated($id);
        $response = Response::make(view("consolidated_laws",['laws'=>$laws])->render(), 200);
        return $response;
    }
}
