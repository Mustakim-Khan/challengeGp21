<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\ForumRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation\Blameable;
use Symfony\Component\Serializer\Annotation\Context;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: ForumRepository::class)]
#[ApiResource(
    order: ['createdAt' => 'DESC'],
)]
#[Get(normalizationContext: ['groups' => ['read_Forum']],)]
#[GetCollection(
    normalizationContext: ['groups' => ['read_Forums']],
)]
#[GetCollection(
    uriVariables: [
        'userId' => new Link(
            fromClass: User::class,
            fromProperty: 'forums'
        )
    ],
    uriTemplate: '/users/{userId}/forums.{_format}',
    normalizationContext: ['groups' => ['user:forums'],],
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you are not the owner.'
)]
#[Post(
    denormalizationContext: ['groups' => ['write_Forum']],
)]
#[Put(
    denormalizationContext: ['groups' => ['update_forum']],
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you have a wrong right to access this ressource.'
)]
#[Patch(
    denormalizationContext: ['groups' => ['update_forum']],
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you have a wrong right to access this ressource.'
)]
#[Delete(
    security: "is_granted('ROLE_MODERATOR')",
    securityMessage: 'Sorry, but you have a wrong right to access this ressource.'
)]
#[ApiFilter(SearchFilter::class, properties: [
    'isValid' => 'exact',
    'createdBy' => 'exact',
])]
class Forum
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['read_Forum', 'read_Forums', 'user:forums',])]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(inversedBy: 'forums')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read_Forum', 'user:forums', 'read_Forums'])]
    #[Blameable(on: 'create')]
    private ?User $createdBy = null;

    #[ORM\Column]
    #[Groups(['read_Forum', 'read_Forums'])]
    #[Context([DateTimeNormalizer::FORMAT_KEY => \DateTime::RFC822])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read_Forum', 'read_Forums', 'write_Forum',  'update_forum', 'user:forums', 'read_Comment'])]
    private ?string $title = null;

    #[ORM\Column]
    #[Groups(['read_Forum', 'read_Forums', 'update_forum', 'user:forums'])]
    private ?bool $isValid = false;

    #[ORM\OneToMany(mappedBy: 'forum', targetEntity: Comment::class)]
    #[Groups(['read_Forum', 'read_Forums', 'user:forums'])]
    private Collection $comments;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['read_Forum', 'read_Forums', 'write_Forum', 'update_forum', 'user:forums'])]
    private ?string $content = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable("now", new \DateTimeZone("Europe/Paris"));
        $this->comments = new ArrayCollection();
        $this->isValid = false;
    }

    public function getId(): ?Uuid
    {
        return $this->id;
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

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

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

    public function isIsValid(): ?bool
    {
        return $this->isValid;
    }

    public function setIsValid(bool $isValid): self
    {
        $this->isValid = $isValid;

        return $this;
    }

    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setForum($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getForum() === $this) {
                $comment->setForum(null);
            }
        }

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
}
