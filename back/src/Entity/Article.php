<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use App\Repository\ArticleRepository;
use Doctrine\DBAL\Types\Types;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\OrderBy;
use Symfony\Component\Serializer\Annotation\Context;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Uid\Uuid;
use ApiPlatform\Metadata\Link;
use Gedmo\Mapping\Annotation\Blameable;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
#[ApiResource(
    denormalizationContext: ['groups' => ['write_article']],
    // paginationEnabled: true,
    order: ['createdAt' => 'DESC'],
)]
#[ApiResource(
    uriVariables: [
    'userId' => new Link(
        fromClass: User::class,
        fromProperty: 'articles'
    )],
)]
#[Get(normalizationContext: ['groups' => ['get_article']],)]
#[GetCollection(normalizationContext: ['groups' => ['getc_article']],)]
#[GetCollection(
    uriTemplate: '/users/{userId}/articles.{_format}',
    normalizationContext: ['groups' => ['user:articles'],],
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you are not the article owner.'
)]
#[Patch(
    denormalizationContext: ['groups' => ['update_article']],
)]
#[Post(
    normalizationContext: ['groups' => ['get_article']],
    denormalizationContext: ['groups' => ['post_article']],
    security: "is_granted('ROLE_MODERATOR')",
    securityMessage: 'Sorry, but you are not the admin.'
)]
#[Delete(
    security: "is_granted('ROLE_MODERATOR')",
    securityMessage: 'Sorry, but you are not the admin.'
)]
#[Put(
    normalizationContext: ['groups' => ['get_article']],
    denormalizationContext: ['groups' => ['post_article']],
    security: "is_granted('ROLE_MODERATOR')",
    securityMessage: 'Sorry, but you are not the admin.'
)]
class Article
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['get_article', 'getc_article', 'user:articles'])]
    private ?Uuid $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['get_article', 'getc_article', 'update_article', 'user:articles','post_article'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['get_article', 'getc_article', 'update_article', 'user:articles','post_article'])]
    private ?string $content = null;

    #[ORM\Column]
    #[Groups(['get_article', 'getc_article', 'user:articles'])]
    #[Context([DateTimeNormalizer::FORMAT_KEY => \DateTime::RFC822])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[Groups(['getc_article', 'user:articles'])]
    #[Blameable(on: 'create')]
    private ?User $createdBy = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable("now", new \DateTimeZone("Europe/Paris"));
    }

    public function getId(): ?Uuid
    {
        return $this->id;
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

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

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

    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): self
    {
        $this->createdBy = $createdBy;

        return $this;
    }
}
