<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\DomCrawler\Crawler;

class UniversityNoticeController extends Controller
{
    public function fetchNotices()
    {
        try {
            $notices = \Cache::remember('university_notices', 300, function () {
                $response = \Http::get('https://exam.pu.edu.np/ViewAllNotice');
                if (!$response->ok()) {
                    return [];
                }
                $html = $response->body();
                $crawler = new Crawler($html);
                $noticeLinks = $crawler->filter('a')->reduce(function (Crawler $node) {
                    $href = $node->attr('href');
                    return $href && strpos($href, '/Show/Notice/') !== false;
                });
                $notices = [];
                foreach ($noticeLinks as $element) {
                    $node = new Crawler($element);
                    $title = trim($node->text());
                    $href = $node->attr('href');
                    $date = null;
                    if (preg_match('/^(\d{4} \w{3} \d{2})/', $title, $matches)) {
                        $date = $matches[1];
                    }
                    $notices[] = [
                        'title' => $title,
                        'url' => 'https://exam.pu.edu.np/ViewAllNotice',
                        'notice_date' => $date,
                    ];
                }
                return $notices;
            });
            return response()->json(['items' => $notices]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}