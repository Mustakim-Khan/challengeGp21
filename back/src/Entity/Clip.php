<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Controller\ClipVideoController;
use App\Repository\ClipRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation\Blameable;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use ApiPlatform\OpenApi\Model;

#[ORM\Entity(repositoryClass: ClipRepository::class)]
#[Vich\Uploadable]
#[ApiResource(
    normalizationContext: ['groups' => ['read_CLip']],
    denormalizationContext: ['groups' => ['write_Clip']],
    order: ['createdAt' => 'DESC'],
)]
#[GetCollection(
    uriTemplate: '/clips',
    paginationEnabled: true,
    paginationItemsPerPage: 10,
    normalizationContext: ['groups' => ['read_Clips']],
)]
#[GetCollection(
    uriTemplate: '/clips/valid',
    paginationEnabled: true,
    paginationItemsPerPage: 10,
    normalizationContext: ['groups' => ['read_Clips']],
)]
#[Post(
    uriTemplate: '/clips/video',
    controller: ClipVideoController::class,
    deserialize: false,
    openapi: new Model\Operation(
        requestBody: new Model\RequestBody(
            content: new \ArrayObject([
                'multipart/form-data' => [
                    'schema' => [
                        'type' => 'object', 
                        'properties' => [
                            'file' => [
                                'type' => 'string', 
                                'format' => 'binary'
                            ],
                            'title' => [
                                'type' => 'string'
                            ]
                        ]
                    ]
                ]
            ])
        )
    )
)]
class Clip
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['read_Clip', 'read_Clips'])]
    private ?Uuid $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read_Clip', 'write_Clip', 'read_Clips'])]
    private ?string $path = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    private $fileSize;

    #[Vich\UploadableField(mapping: 'clips', fileNameProperty: 'path', size: 'fileSize')]
    private ?File $file = null;

    #[ORM\ManyToOne(inversedBy: 'clips')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read_Clip', 'read_Clips'])]
    #[Blameable(on: 'create')]
    private ?User $uploadedBy = null;

    #[ORM\Column]
    #[Groups(['read_Clip'])]
    private ?bool $isValid = false;

    #[ORM\Column(length: 255)]
    #[Groups(['read_Clip', 'write_Clip', 'read_Clips'])]
    private ?string $title = null;

    #[ORM\Column]
    #[Groups(['read_Clip', 'read_Clips'])]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable("now", new \DateTimeZone("Europe/Paris"));
        $this->isValid = false;
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): self
    {
        $this->path = $path;

        return $this;
    }

    public function getUploadedBy(): ?User
    {
        return $this->uploadedBy;
    }

    public function setUploadedBy(?User $uploadedBy): self
    {
        $this->uploadedBy = $uploadedBy;

        return $this;
    }

    public function isIsValid(): ?bool
    {
        return $this->isValid;
    }

    public function setIsValid(bool $isValid): self
    {
        $this->isValid = $isValid;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getFile() : ?File
    {
        return $this->file;
    }

    public function setFile(File $file) : self
    {
        $this->file = $file;

        return $this;
    }
  
    public function getFileSize() : ?int
    {
        return $this->fileSize;
    }


    public function setFileSize(int $fileSize) : self
    {
        $this->fileSize = $fileSize;

        return $this;
    }
}
