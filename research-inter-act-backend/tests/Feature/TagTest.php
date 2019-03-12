<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TagTest extends TestCase
{
    use WithoutMiddleware;

    public function test_export(){
        $this->get('/api/tags/csv')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Tags.csv");
    }
}
