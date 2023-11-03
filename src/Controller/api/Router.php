<?php

namespace App\Controller\api;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\RouterInterface;

class Router extends AbstractController
{
    /**
     * Retourne les différentes route
     */
    #[Route("/api/router", name: 'api_router', methods: ['GET'])]
    public function getRouteForReact(RouterInterface $router): JsonResponse
    {
        $router = $router->getRouteCollection()->all();

        return $this->json($router);
    }
}
