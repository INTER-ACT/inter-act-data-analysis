<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use WithoutMiddleware;

    public function test_index(){
        $this->get('/api/users')
            ->assertOk()
            ->assertJsonCount(User::all()->count())
            ->assertJsonStructure([[
                "user_id",
                "username",
                "email",
                "passwort",
                "vorname",
                "nachname",
                "is_male",
                "plz",
                "ort",
                "beruf",
                "geb_jahr",
                "rechtskenntnisse",
                "ausbildung",
                "hash",
                "gesperrt",
                "geloescht",
                "aktiv",
                "ip",
                "reg_datum",
                "aktiv_datum"
            ]]);
    }

    public function test_show(){
        $user=User::find(1);
        $this->get('/api/user/1')
            ->assertOk()
            ->assertJson([
                "user_id"=>$user->user_id,
                "username"=>$user->username,
                "email"=>$user->email,
                "passwort"=>$user->passwort,
                "vorname"=>$user->vorname,
                "nachname"=>$user->nachname,
                "is_male"=>$user->is_male,
                "plz"=>$user->plz,
                "ort"=>$user->ort,
                "beruf"=>$user->beruf,
                "geb_jahr"=>$user->geb_jahr,
                "rechtskenntnisse"=>$user->rechtskenntnisse,
                "ausbildung"=>$user->ausbildung,
                "hash"=>$user->hash,
                "gesperrt"=>$user->gesperrt,
                "geloescht"=>$user->geloescht,
                "aktiv"=>$user->aktiv,
                "ip"=>$user->ip,
                "reg_datum"=>$user->reg_datum,
                "aktiv_datum"=>$user->aktiv_datum
            ]);
    }

    public function test_export(){
        $this->get('/api/users/csv')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Users.csv");
    }
}
