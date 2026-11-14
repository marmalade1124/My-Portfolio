export const WRITING = [
  {
    slug: 'designing-from-the-workflow', title: 'Designing from the workflow',
    summary: 'What the quote needs to remember after the slicer closes.', project: 'quoter',
    sections: [
      ['Start with the handoff', 'A print quote begins with information that already exists in the slicer. The design question is how to bring the useful numbers into the quote while giving the operator room to review and adjust them.'],
      ['Make the calculation visible', 'A useful total carries its assumptions with it. An itemized receipt makes material, machine time and other inputs easier to review before sending a quote.'],
      ['Keep the editable record', 'An exported estimate is a snapshot. Keeping the inputs visible in the editor makes it possible to correct a recommendation without redoing the import.'],
    ],
  },
  {
    slug: 'keeping-layouts-steady', title: 'Keeping layouts steady',
    summary: 'Loading, success and error can all fit in the same space.', project: 'viewportlab',
    sections: [
      ['Reserve room for the response', 'A button often changes labels after a request. Give the control enough room for its intermediate states so neighboring controls stay where the visitor expects.'],
      ['Run the same interaction twice', 'Both samples below complete the same mock export. In the first, the button measures its text. In the second, it reserves enough inline space for the longest label.'],
      ['Check the narrowest width', 'A reserved width needs to fit translated labels and small screens. Test the whole row, including focus outlines and what happens when labels wrap.'],
    ],
  },
  {
    slug: 'testing-motion-between-pages', title: 'Testing motion between pages',
    summary: 'A route transition needs a first visit, a repeat visit and an interruption.', project: 'lapcat-website',
    sections: [
      ['Test the first click', 'An entrance can layer over a transition immediately after refresh. Test the first click while the header is still animating, then repeat it after everything settles.'],
      ['Test the interruption', 'Back, a second click and a motion-preference change all interrupt a timeline. Compare the abrupt swap with a staged handoff in the example below.'],
      ['Measure the visible layers', 'Track the outgoing page, incoming page and headline separately. A fade can look uneven when different elements take turns drawing attention.'],
    ],
  },
  {
    slug: 'giving-color-a-role', title: 'Giving color a role',
    summary: 'A palette becomes useful when every color has a job.', project: 'picolor',
    sections: [
      ['Give each color a job', 'A sampled color is an input. A palette needs roles for the surface, text, accents and the situations where visitors need to act.'],
      ['Compare themes in context', 'A palette has to survive real labels and components. Switch the example below between light and dark and inspect the text and surface contrast.'],
      ['Export the roles together', 'CSS variables carry the roles to another project. Keeping the role names stable lets the interface change theme without rewriting its components.'],
    ],
  },
] as const;

export const writingPath = (slug: string) => `/writing/${slug}`;
