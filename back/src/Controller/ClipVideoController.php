<?php
namespace App\Controller;

use App\Entity\Clip;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
final class ClipVideoController extends AbstractController
{
    public function __invoke(Request $request): Clip
    {
        $uploadedFile = $request->files->get('file');
        if (!$uploadedFile) {
            throw new BadRequestHttpException('"file" is required');
        }

        $clipVideo = new Clip();
        $clipVideo->setFile($uploadedFile);
        $clipVideo->setTitle($request->request->get('title'));
        $clipVideo->setUploadedBy($this->getUser());

        return $clipVideo;
    }
}