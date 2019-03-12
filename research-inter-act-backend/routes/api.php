<?php

use Illuminate\Http\Request;
Use App\Law;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::middleware(['basicAuth'])->group(function () {


    //region Request URLs for Laws
    Route::get('gesetze',"LawController@index");
    Route::get('gesetz/{id}',"LawController@show");
    Route::get('gesetz/{id}/csv',"LawController@exportOne");
    Route::get('gesetze/csv',"LawController@export");
    Route::get('gesetz/{id}/kommentare',"LawController@showComments");
    Route::get('gesetz/{id}/kommentare/csv',"LawController@exportComments");
    Route::get('gesetz/{id}/aenderungen',"LawController@showLawChanges");
    Route::get('gesetz/{id}/aenderungen/csv',"LawController@exportLawChanges");
    Route::get('gesetz/{id}/ratings',"LawController@showRatings");
    Route::get('gesetz/{id}/ratings/csv',"LawController@exportRatings");
    Route::get('gesetz/{id}/statistiken',"LawController@showStatistics");
    //endregion

    //region Request URLs for LawChanges

    Route::get('aenderungen',"LawChangeController@index");
    Route::get('aenderung/{id}',"LawChangeController@show");
    Route::get('aenderungen/csv',"LawChangeController@export");
    Route::get('aenderung/{id}/csv',"LawChangeController@exportOne");

    Route::get('aenderung/{id}/aenderungen/csv',"LawChangeController@exportLawChanges");
    Route::get('aenderung/{id}/aenderungen',"LawChangeController@showLawChanges");
    Route::get('aenderung/{id}/kommentare',"LawChangeController@showComments");
    Route::get('aenderung/{id}/kommentare/csv',"LawChangeController@exportComments");
    Route::get('aenderung/{id}/ratings',"LawChangeController@showRatings");
    Route::get('aenderung/{id}/ratings/csv',"LawChangeController@exportRatings");
    Route::get('aenderung/{id}/gesetz/csv',"LawChangeController@exportReferenceLaw");
    Route::get('aenderung/{id}/referenz/csv',"LawChangeController@exportReference");
    //endregion


    //region Request URLs for Comments

    Route::get('kommentare',"CommentController@index");
    Route::get('kommentar/{id}',"CommentController@show");
    Route::get('kommentare/csv',"CommentController@export");
    Route::get('kommentar/{id}/csv',"CommentController@exportOne");
    Route::get('kommentar/{id}/kommentare/csv',"CommentController@exportComments");
    Route::get('kommentar/{id}/referenz/csv',"CommentController@exportReference");
    //endregion

    //region Request URLs for Ratings, Users, Tags

    Route::get('ratings',"RatingController@index");
    Route::get('rating/{id}',"RatingController@show");
    Route::get('ratings/csv',"RatingController@export");

    Route::get('users',"UserController@index");
    Route::get('user/{id}',"UserController@show");
    Route::get('users/csv',"UserController@export");


    Route::get('tags',"TagController@index");
    Route::get('tag/{id}/kommentar/{k_id}',"TagController@showByComment");
    Route::get('tag/{id}/gesetz/{g_id}',"TagController@showByLaw");
    Route::get('tag/{id}/aenderung/{a_id}',"TagController@showByLawChange");
    Route::get('tags/csv',"TagController@export");
    //endregion


    //region Request URLs for Settings
    Route::get('einstellungen','SettingController@index');
    Route::get('einstellung/{id}',"SettingController@show");
    Route::put('einstellung',"SettingController@update");
    //endregion

    //region Request URLs for Statistics
    Route::get('statistiken','StatisticController@index');
    Route::get('statistik/{id}',"StatisticController@show");
    //endregion

    //region Request URLS for LegalExpertises
    Route::get('rechtskenntnisse','LegalExpertiseController@index');
    Route::get('rechtskenntniss/{id}','LegalExpertiseController@show');
    //endregion

    //region Request URLS for Educations
    Route::get('ausbildungen','EducationController@index');
    Route::get('ausbildung/{id}','EducationController@show');
    //endregion
});

    Route::get('wordcloud','WordcloudController@show');
    Route::post('statistik',"StatisticController@store");
    Route::get('user/{id}/gesetze/neu',"UserController@showLawsConsolidated");
    Route::get('user/{id}/gesetze/neu/html',"UserController@showLawsConsolidatedHtml");
    Route::get('gesetze/neu',"LawController@consolidated");
    Route::get('gesetze/neu/html',"LawController@consolidatedHtml");