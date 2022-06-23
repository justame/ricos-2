import type { PollNode } from 'ricos-content';
import {
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
  PollData_Design_PollDesign_Background_Type,
  PollData_Layout_PollLayout_Direction,
  PollData_Layout_PollLayout_Type,
  PollData_Poll_Settings_Permissions_ViewRole,
  PollData_Poll_Settings_Permissions_VoteRole,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { pollConverter } from './poll-converter';

describe('Poll converter', () => {
  const tiptapNode = {
    type: Node_Type.POLL,
    attrs: {
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        textWrap: true,
      },
      poll: {
        options: [
          {
            id: '067ed3b5-f19d-4886-8f23-acd84a586522',
            title: 'Cafe Nordoy',
            image: {
              src: {
                url: 'https://static.wixstatic.com/media/3efa7e_f12aec64c02f464c9d3f0f6d62ec7384~mv2.png',
              },
            },
          },
          {
            id: 'ee32a57f-bf6c-425a-a20c-e678bcf4a73b',
            title: 'קפה רוטשילד 65',
            image: {
              src: {
                url: 'https://static.wixstatic.com/media/3efa7e_c6ebbeecf9b4494f91244656beee6e78~mv2.jpg',
              },
            },
          },
          {
            id: '41679bf9-89ba-41f2-81d3-832d567531da',
            title: 'האחים',
            image: {
              src: {
                url: 'https://static.wixstatic.com/media/3efa7e_26d7f9c215944dbcb783c6b16f536c33~mv2.jpg',
              },
            },
          },
          {
            id: '378c6042-55cc-4e4a-9f0c-77824bee4964',
            title: 'הוטל מונטיפיורי',
            image: {
              src: {
                url: 'https://static.wixstatic.com/media/3efa7e_d9b16be508ce41aa8e635d0e9e97b923~mv2.jpeg',
              },
            },
          },
        ],
        id: 'f3fa62b4-6d75-4016-a895-acb793ca6f5c',
        title: 'Where do you want to have breakfast tomorrow to use the monthly budget?',
        creatorId: '3efa7e86-fc25-4ef1-a002-19769b84202f',
        image: {
          src: {
            url: 'https://static.wixstatic.com/media/436483e6ed9e41fe91b9f286d2ea4efb.jpg',
          },
        },
        settings: {
          permissions: {
            view: PollData_Poll_Settings_Permissions_ViewRole.VOTERS,
            vote: PollData_Poll_Settings_Permissions_VoteRole.SITE_MEMBERS,
            allowMultipleVotes: true,
          },
          showVoters: true,
          showVotesCount: true,
        },
      },
      layout: {
        poll: {
          type: PollData_Layout_PollLayout_Type.GRID,
          direction: PollData_Layout_PollLayout_Direction.LTR,
          enableImage: false,
        },
        options: {
          enableImage: true,
        },
      },
      design: {
        poll: {
          background: {
            type: PollData_Design_PollDesign_Background_Type.IMAGE,
            image: {
              src: {
                url: 'https://static.wixstatic.com/media/2dfdd3_b120b7d9cffd4645bb143beadef13c56~mv2.jpg',
              },
            },
          },
          borderRadius: 0,
        },
        options: {
          borderRadius: 0,
        },
      },
      id: '36',
    },
  };

  const pollNode: PollNode = {
    type: Node_Type.POLL,
    id: '36',
    nodes: [],
    pollData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      poll: {
        id: 'f3fa62b4-6d75-4016-a895-acb793ca6f5c',
        title: 'Where do you want to have breakfast tomorrow to use the monthly budget?',
        creatorId: '3efa7e86-fc25-4ef1-a002-19769b84202f',
        image: {
          src: {
            url: 'https://static.wixstatic.com/media/436483e6ed9e41fe91b9f286d2ea4efb.jpg',
          },
        },
        options: [
          {
            id: '067ed3b5-f19d-4886-8f23-acd84a586522',
            title: 'Cafe Nordoy',
            image: {
              src: {
                url: 'https://static.wixstatic.com/media/3efa7e_f12aec64c02f464c9d3f0f6d62ec7384~mv2.png',
              },
            },
          },
          {
            id: 'ee32a57f-bf6c-425a-a20c-e678bcf4a73b',
            title: 'קפה רוטשילד 65',
            image: {
              src: {
                url: 'https://static.wixstatic.com/media/3efa7e_c6ebbeecf9b4494f91244656beee6e78~mv2.jpg',
              },
            },
          },
          {
            id: '41679bf9-89ba-41f2-81d3-832d567531da',
            title: 'האחים',
            image: {
              src: {
                url: 'https://static.wixstatic.com/media/3efa7e_26d7f9c215944dbcb783c6b16f536c33~mv2.jpg',
              },
            },
          },
          {
            id: '378c6042-55cc-4e4a-9f0c-77824bee4964',
            title: 'הוטל מונטיפיורי',
            image: {
              src: {
                url: 'https://static.wixstatic.com/media/3efa7e_d9b16be508ce41aa8e635d0e9e97b923~mv2.jpeg',
              },
            },
          },
        ],
        settings: {
          permissions: {
            view: PollData_Poll_Settings_Permissions_ViewRole.VOTERS,
            vote: PollData_Poll_Settings_Permissions_VoteRole.SITE_MEMBERS,
            allowMultipleVotes: true,
          },
          showVoters: true,
          showVotesCount: true,
        },
      },
      layout: {
        poll: {
          type: PollData_Layout_PollLayout_Type.GRID,
          direction: PollData_Layout_PollLayout_Direction.LTR,
          enableImage: false,
        },
        options: {
          enableImage: true,
        },
      },
      design: {
        poll: {
          background: {
            type: PollData_Design_PollDesign_Background_Type.IMAGE,
            image: {
              src: {
                url: 'https://static.wixstatic.com/media/2dfdd3_b120b7d9cffd4645bb143beadef13c56~mv2.jpg',
              },
            },
          },
          borderRadius: 0,
        },
        options: {
          borderRadius: 0,
        },
      },
    },
  };

  it('should convert PollNode to TiptapNode', () => {
    const actual = pollConverter.toTiptap.convert(pollNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to PollNode', () => {
    const actual = pollConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(pollNode);
  });
});
