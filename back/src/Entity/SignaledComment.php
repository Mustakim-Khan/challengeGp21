<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use App\Repository\SignaledCommentRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation\Blameable;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: SignaledCommentRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read_SignaledComment']],
    denormalizationContext: ['groups' => ['write_SignaledComment']],
    paginationEnabled: true,
    uriVariables: [
        'userId' => new Link(
            fromClass: User::class,
            fromProperty: 'signaledComments'
        )
    ],
)]
#[GetCollection(
    uriTemplate: '/users/{userId}/comments-signaled.{_format}',
    normalizationContext: ['groups' => ['user:commentsSignaledByMe'],],
    security: "is_granted('ROLE_MODERATOR') or object == user",
    securityMessage: 'Sorry, but you are not the owner.'
)]
#[ApiFilter(SearchFilter::class, properties: [
    'signaledUser' => 'exact',
    'signaledBy' => 'exact',
])]
class SignaledComment
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['read_SignaledComment', 'user:commentsSignaledByMe'])]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(inversedBy: 'signaledComments')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read_SignaledComment'])]
    #[Blameable(on: 'create')]
    private ?User $signaledBy = null;

    #[ORM\ManyToOne(inversedBy: 'mySignaledComments')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read_SignaledComment', 'write_SignaledComment', 'user:commentsSignaledByMe'])]
    private ?User $signaledUser = null;

    #[ORM\ManyToOne(inversedBy: 'signaledComments')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read_SignaledComment', 'write_SignaledComment', 'user:commentsSignaledByMe'])]
    private ?Comment $comment = null;

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getSignaledBy(): ?User
    {
        return $this->signaledBy;
    }

    public function setSignaledBy(?User $signaledBy): self
    {
        $this->signaledBy = $signaledBy;

        return $this;
    }

    public function getSignaledUser(): ?User
    {
        return $this->signaledUser;
    }

    public function setSignaledUser(?User $signaledUser): self
    {
        $this->signaledUser = $signaledUser;

        return $this;
    }

    public function getComment(): ?Comment
    {
        return $this->comment;
    }

    public function setComment(?Comment $comment): self
    {
        $this->comment = $comment;

        return $this;
    }
}
