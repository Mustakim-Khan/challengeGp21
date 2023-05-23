<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\MediaRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation\Blameable;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: MediaRepository::class)]
#[ApiResource()]
#[Get(normalizationContext: ['groups' => ['read_Media']])]
#[GetCollection(normalizationContext: ['groups' => ['getc_Media']])]
#[GetCollection(
    uriVariables: [
        'userId' => new Link(
            fromClass: User::class,
            fromProperty: 'medias'
        )
    ],
    uriTemplate: '/users/{userId}/medias.{_format}',
    normalizationContext: ['groups' => ['user:medias'],],
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you are not the owner.'
)]
#[Post(
    denormalizationContext: ['groups' => ['write_Media']],
)]
#[Put(
    denormalizationContext: ['groups' => ['update_Media']],
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you are not the admin.'
)]
#[Patch(
    denormalizationContext: ['groups' => ['update_Media']],
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you are not the admin.'
)]
#[Delete(
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you are not the admin.'
)]
#[ApiFilter(SearchFilter::class, properties: [
    'owner' => 'exact',
    'type' => 'partial',
])]
class Media
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['read_Media', 'getc_Media', 'user:medias'])]
    private ?Uuid $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read_Media', 'write_Media', 'getc_Media', 'update_Media', 'user:medias'])]
    private ?string $type = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read_Media', 'write_Media', 'getc_Media', 'update_Media', 'user:medias'])]
    private ?string $path = null;

    #[ORM\ManyToOne(inversedBy: 'medias')]
    #[Groups(['read_Media', 'getc_Media'])]
    #[Blameable(on: 'create')]
    private ?User $owner = null;

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
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

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }
}
