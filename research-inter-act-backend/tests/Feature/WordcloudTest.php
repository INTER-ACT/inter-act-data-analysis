<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class WordcloudTest extends TestCase
{
    use WithoutMiddleware;

    public function test_show(){
        $this->get('/api/wordcloud')
            ->assertOk()
            ->assertHeader('Content-Type', 'php');
    }
}
