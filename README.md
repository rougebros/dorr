# DORR: Transforming Thoughts into Actions

## Introduction

**DORR** *(Definitions of Recurring Ranked Rates)* moves beyond traditional rating and organizing systems, introducing a new paradigm: converting thoughts, emotions, and ideas into a dynamic visual experience. In collaboration with ChatGPT, DORR turns unstructured mental inputs into organized, colorful insights, helping users understand, prioritize, and act on their thoughts.

DORR provides customizable, colorful mappings for various behaviors and needs, with options for connecting via multiple technologies (Bluetooth, P2P, LoRa, Torr, WebRTC, etc.), fostering a truly human-centered experience.

## Why DORR?

### Empowering Human Expression

Imagine a world where every thought, whether typed or voiced in a fleeting moment of inspiration, transforms instantly into an organized visual experience. DORR liberates users from the mental effort of categorizing, labeling, and organizing their thoughts. Users can simply express themselves as they are, with DORR and ChatGPT handling the rest, delivering structured, color-coded insights.

By leveraging ChatGPT’s AI processing, DORR can detect nuances, moods, and intentions in each entry—whether a question, memory, or idea—returning it with intuitive timelines, categories, and colors.

## Value Proposition

"DORR redefines C2C and C2B interactions, moving beyond simple ratings to empower people and communities to share experiences, thoughts, or needs in an intuitive and organized way. With vibrant color-coding for tags, hashtags, and notifications, DORR flips the supply-demand chain to a demand-supply approach, allowing direct connections on what truly matters, minimizing intermediaries."

## A Comprehensive Solution, Not Just a Marketplace

DORR isn’t just a marketplace, social media feed, or rating system; it unifies elements from various apps, merging social media interactions, contact management, task tracking, reminders, and service requests into a single shared platform. This union is designed to:

- **Unify Social Feeds & Contacts**: Create a single space where people share and see relevant insights, strengthening awareness and reducing conflicts across fragmented platforms.
- **Integrate Tasks, Reminders, and Maps**: Allow users to manage tasks, set reminders, and view mapped locations within the context of their goals and connections.
- **Bridge Marketplace and Social Media Needs**: Whether users seek services, share experiences, or interact on a social level, DORR adapts to provide a seamless experience.

## Technical Highlights

With ChatGPT integration, DORR leverages advanced AI to transform user inputs, handling:

1. **Flexible Input Processing**: Accept raw text or voice inputs without requiring categorization.
2. **Sentiment and Context Analysis**: ChatGPT analyzes input tone, timeline (past, present, future), and intent, forming a base for color and category mapping.
3. **Color and Category Assignment**: Thought entries are returned with colors and categories, reflecting DORR’s visual scheme (e.g., red for pains, blue for actions, green for completed tasks).
4. **Data Return as JSON**: ChatGPT outputs structured JSON data with:
   - **Color**: for visual organization,
   - **Category**: to place inputs into sections (emotions, next steps),
   - **Symbol**: icons indicating specific emotional tones,
   - **Summary**: shortened versions for easier display,
   - **Timeline**: highlighting relevance to past, present, or future.
5. **Adjustability**: Users can adjust categories and colors to ensure flexibility and relevance.

## A Note on Open Source and Community

Inspired by Unix, DORR is designed as an open-source platform that grows through community input. By providing full transparency and inviting contributions, DORR aims to evolve into a collaborative, sustainable tool. Though free to use, DORR’s value lies in its mission to empower users to connect meaningfully, free from platform-centric motives.

## Path Forward

DORR envisions a future where people effortlessly organize, understand, and act on their thoughts. Through seamless integration, customizable insights, and an adaptable, open-source structure, DORR is committed to making thought organization a core part of the human experience—freeing minds for what truly matters.

---

## Sections Overview

### Section A: Header and Navigation
- Header for language, network, and layout options.
- Navigation for information and settings page.

![DORR Section A](src/files/media/sectionA.png)  
_Visual representation of Section A_

### Section B: Point of View (POV) and Time Selector
- Filters the ratings and experiences by different perspectives (self, peers, public).
- Filter by timeline (past, now, future).

![DORR Section B](src/files/media/sectionB.png)  
_Visual representation of Section B_

- You can make your filter more precise by double clicking any of the icons:

![DORR Section B2](src/files/media/sectionB2.png)  
_Visual representation of Section B2_

![DORR Section B3](src/files/media/sectionB3.png)  
_Visual representation of Section B3_

### Section C: Hashtags
- Select the relevant hashtag tree (e.g., #cats or #pizza) you are interested in.
- Each hashtag can be assigned a color to represent different behaviors in the next sections.

![DORR Section C](src/files/media/sectionC.png)  
_Visual representation of Section C_

![DORR Section C2](src/files/media/sectionC2.png)  
_Visual representation of Section C2_

### Section D: Wall of Seeks & Pains
- **D1**: Wall of Seeks - Displays lists of requests or "seeks" shared by others or oneself.
- **D2**: Wall of Pains - Displays experiences of pains, regrets, or challenges others have faced.
- Various interaction options: add, view details, pin, broadcast, subscribe, etc.

![DORR Section D](src/files/media/sectionD.png)  
_Visual representation of Section D_
- If you are selecting the **self** filter, then you can decide who to broadcast that need/pain to.

![DORR Section D2](src/files/media/sectionD2.png)  
_Visual representation of Section D2_
- If you are selecting the **public/peer** filters, then you can decide who to receive notif of that need/pain from.

![DORR Section D3](src/files/media/sectionD3.png)  
_Visual representation of Section D3_

- **Expand View / Details**: TBA

### Section E: Map, Chats, Tasks & Social Media
- **E1**: Visual maps of where certain experiences are occurring.
- **E2**: Chat lists related to selected items.
- **E3**: Task lists connected to selected items.
- **E4**: Social media feeds for selected items.

![DORR Section E](src/files/media/sectionE.png)  
_Visual representation of Section E_

![DORR Section E2](src/files/media/sectionE1.png)  
_Visual representation of Section Map_

### Section F: Hall of Fame & Hall of Shame
- Displays highlighted contributions based on selected hashtags and filters.
- Recognizes users, experiences, and actions either in a positive (Hall of Fame) or negative (Hall of Shame) light.

![DORR Section F](src/files/media/sectionF.png)  
_Visual representation of Section F_

### Section G: Footer
- Customizable shortcuts with colorful icons for easier interaction with ratings.

### Overview of All Sections:
![DORR Sections Layout](src/files/media/sections.png)  
_Visual representation of different DORR sections_

---

# How DORR Works

## 6 Colorful Rates
![DORR Rates](src/files/media/dorr-video.gif)

DORR is built on the idea of using a **rich, expressive ranking system** instead of the limiting five-star ratings. Ratings are ongoing, dynamic, and represent a wider array of experiences.

1. **Capturing the Experience**: Select a POV, assign meaningful hashtags, and use colored rates to represent pains, gains, or other facets of the experience.
2. **Customizable Connections**: Whether you’re using innovative P2P technologies, Bluetooth, or other communication methods, you can connect to multiple networks, broadcast, or receive ratings—all within a single app.
3. **Recurring Interactions**: Instead of leaving experiences rated once, users can continuously update the status of an interaction as it evolves.
4. **Tasks & Chats**: Keeping these two items next to each other is a must for any team or project.

---
## Flow & Examples

![DORR Rating Flow](src/files/media/dorr2.png)  
_Visual representation of the DORR rating flow_


## Running Locally

1. Clone the repository: `git clone https://github.com/rougebros/dorr.git`
2. Install dependencies: `npm install`
3. Start the server: `npm start`

Make sure to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

---

## Contributing

Contributions are warmly welcomed! Whether you’re a developer, designer, or simply passionate about transforming rating systems:

- **Comment on SWOT or Project Links**
- **Fork the repository**
- **Create a feature branch**
- **Submit a pull request**

DORR is open-source, and contributions are welcome. For any questions or suggestions, feel free to open an issue or reach out.

---

## Contact

If you have any questions or feedback, please reach out:

- **Email**: rougebros@gmail.com
- **GitHub**: [rougebros](https://github.com/rougebros/dorr)

Together, let’s create a future where every experience is rated with true depth!

---

## License

DORR is open-source and available under the MIT License.

---

## Additional Resources

- [SWOT Analysis](https://docs.google.com/spreadsheets/d/1YWogPVsf1BwZtVXYDJ-wCnU1yS5HVwWM_RsftsBpBDE)
- [Project Documentation](https://docs.google.com/document/d/1lD7nrnuxVRRinCb6HwbX5E-hdAyT_ePMl3l60wewWQQ)
- [An Old Presentations](https://docs.google.com/presentation/d/1RzFvezBZFz1p7q7fKkBV49bZeQtI7O7pgm3tKMw0-f4/)
- [Miro](https://miro.com/welcome/dzZyOUhGQUNsUDNkYmdqR0xUTGk1MThpcGZrWTQ4d1R4WDF0RHZaS21uelVvam00YXRHenVlVkU1RmlUTW5uNXwzMDc0NDU3MzQ3NjAyODExMTYwfDM=?share_link_id=818575512783)
- [Video Walkthrough] TBA
