<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Link;
use App\Repository\TournamentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation\Blameable;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: TournamentRepository::class)]
#[ApiResource()]
#[Get(normalizationContext: ['groups' => ['read_Tournament']])]
#[GetCollection(normalizationContext: ['groups' => ['getc_Tournament']])]
#[GetCollection(
    uriVariables: [
        'userId' => new Link(
            fromClass: User::class,
            fromProperty: 'createdTournaments'
        )
    ],
    uriTemplate: '/users/{userId}/tournaments.{_format}',
    normalizationContext: ['groups' => ['user:tournaments'],],
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you are not the owner.'
)]
#[Post(denormalizationContext: ['groups' => ['write_Tournament']])]
#[Put(
    denormalizationContext: ['groups' => ['update_Tournament']],
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you are not the admin.'
)]
#[Patch(
    denormalizationContext: ['groups' => ['update_Tournament']],
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you are not the admin.'
)]
#[Delete(
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you are not the admin.'
)]
#[ApiFilter(SearchFilter::class, properties: [
    'maxPlayers' => 'exact',
    'createdBy' => 'exact',
    'isOver' => 'exact',
    'isFree' => 'exact',
])]
class Tournament
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['read_Tournament', 'getc_Tournament'])]
    private ?Uuid $id = null;

    #[ORM\Column]
    #[Groups(['read_Tournament', 'write_Tournament', 'getc_Tournament', 'update_Tournament', 'user:tournaments'])]
    private ?int $maxPlayers = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'tournaments')]
    #[Groups(['read_Tournament', 'update_Tournament', 'getc_Tournament', 'user:tournaments'])]
    private Collection $participants;

    #[ORM\Column]
    #[Groups(['read_Tournament', 'write_Tournament', 'getc_Tournament', 'update_Tournament', 'user:tournaments'])]
    private ?bool $isFree = true;

    #[ORM\Column]
    #[Groups(['read_Tournament', 'getc_Tournament', 'update_Tournament', 'user:tournaments'])]
    private ?bool $isOver = false;

    #[ORM\ManyToOne(inversedBy: 'createdTournaments')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read_Tournament', 'getc_Tournament', 'user:tournaments'])]
    #[Blameable(on: 'create')]
    private ?User $createdBy = null;

    #[ORM\Column]
    #[Groups(['read_Tournament', 'getc_Tournament', 'user:tournaments'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Groups(['read_Tournament', 'write_Tournament', 'getc_Tournament', 'update_Tournament', 'user:tournaments'])]
    private ?\DateTimeImmutable $participationDeadline = null;

    #[ORM\Column]
    #[Groups(['read_Tournament', 'write_Tournament', 'getc_Tournament', 'update_Tournament', 'user:tournaments'])]
    private ?\DateTimeImmutable $startAt = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read_Tournament', 'write_Tournament',  'getc_Tournament', 'update_Tournament', 'user:tournaments'])]
    private ?string $name = null;

    public function __construct()
    {
        $this->participants = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable("now", new \DateTimeZone("Europe/Paris"));
        $this->isOver = false;
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getMaxPlayers(): ?int
    {
        return $this->maxPlayers;
    }

    public function setMaxPlayers(int $maxPlayers): self
    {
        $this->maxPlayers = $maxPlayers;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getParticipants(): Collection
    {
        return $this->participants;
    }

    public function addParticipant(User $participant): self
    {
        if (!$this->participants->contains($participant)) {
            $this->participants->add($participant);
        }

        return $this;
    }

    public function removeParticipant(User $participant): self
    {
        $this->participants->removeElement($participant);

        return $this;
    }

    public function isIsFree(): ?bool
    {
        return $this->isFree;
    }

    public function setIsFree(bool $isFree): self
    {
        $this->isFree = $isFree;

        return $this;
    }

    public function isIsOver(): ?bool
    {
        return $this->isOver;
    }

    public function setIsOver(bool $isOver): self
    {
        $this->isOver = $isOver;

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

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getParticipationDeadline(): ?\DateTimeImmutable
    {
        return $this->participationDeadline;
    }

    public function setParticipationDeadline(\DateTimeImmutable $participationDeadline): self
    {
        $this->participationDeadline = $participationDeadline;

        return $this;
    }

    public function getStartAt(): ?\DateTimeImmutable
    {
        return $this->startAt;
    }

    public function setStartAt(\DateTimeImmutable $startAt): self
    {
        $this->startAt = $startAt;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }
}
