import z from 'zod';

export const ListSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export const MultiLinkSchema = z.array(
  z.object({
    id: z.string().cuid().optional(),
    rawUrl: z.string().url(),
    rawUrlHash: z.string().optional(),
  })
);

export const LinkSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url({
    message: 'Please enter a valid url',
  }),
  tags: z.array(z.string().cuid()).optional(), // use mui/chip to add tags and pass the cuids
});
