<?php

namespace Tests\Feature;

use App\Setting;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SettingTest extends TestCase
{
    use WithoutMiddleware;

    public function test_index(){
        $this->get('/api/einstellungen')
            ->assertOk()
            ->assertJsonCount(6)
            ->assertJsonStructure([[
                "einstellung_id",
                "faktor",
                "wert"
            ]]);
    }

    public function test_show(){
        $setting=Setting::find(1);
        $this->get('/api/einstellung/1')
            ->assertOk()
            ->assertJson([
                "einstellung_id"=>$setting->einstellung_id,
                "faktor"=>$setting->faktor,
                "wert"=>$setting->wert
            ]);
    }

    public function test_update(){
        $setting=Setting::find(1);
        $setting->wert=3;
        $this->put('/api/einstellung',$setting->toArray())
            ->assertStatus(204);
    }
}
