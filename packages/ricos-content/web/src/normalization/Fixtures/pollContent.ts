export default {
  config: {
    size: 'large',
    width: 'full-width',
    textWrap: 'wrap',
    alignment: 'center',
    enableVoteRole: true,
  },
  poll: {
    id: '844aaf69-12a1-47a2-af1e-6201fbeb8570',
    title: 'Is Ricos the GREATEST?',
    mediaId: 'https://static.wixstatic.com/media/436483e6ed9e41fe91b9f286d2ea4efb.jpg',
    createdBy: 'd0d683f9-81b1-4ec2-84ee-7f49c5245148',
    count: 1,
    anonymousCount: 0,
    ownVotes: ['fbce6f27-9e67-40f4-9884-bf2e9d6fe110'],
    settings: {
      multipleVotes: false,
      voteRole: 'SITE_MEMBERS',
      resultsVisibility: 'VOTERS_ONLY',
      votersDisplay: true,
      votesDisplay: true,
    },
    options: [
      {
        id: 'fbce6f27-9e67-40f4-9884-bf2e9d6fe110',
        title: 'YES!',
        mediaId: 'https://static.wixstatic.com/media/3a27828e768344158489df4f2c03cfb2.jpg',
        count: 1,
        anonymousCount: 0,
        rating: 100,
        latestVoters: ['d0d683f9-81b1-4ec2-84ee-7f49c5245148'],
      },
      {
        id: '97319865-41fe-4bea-9c7b-63888d6c71a7',
        title: 'HELL YES!!!',
        mediaId: 'https://static.wixstatic.com/media/3a27828e768344158489df4f2c03cfb2.jpg',
        count: 0,
        anonymousCount: 0,
        rating: 0,
        latestVoters: [],
      },
    ],
    creatorFlag: true,
  },
  design: {
    poll: {
      background:
        'https://static.wixstatic.com/media/2dfdd3_df028f9258cf4fe0a1b7f75a3916def1~mv2.jpg',
      borderRadius: 0,
      backgroundType: 'image',
    },
    option: { borderRadius: 0 },
  },
  layout: {
    poll: { type: 'list', direction: 'ltr', enableImage: false },
    option: { enableImage: false },
  },
};
