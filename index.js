document.addEventListener('DOMContentLoaded', () => {
    Initialize();
});


const Initialize = async () => {
    console.log('Ready!');

    const FetchBook = async () => {
        return new Promise(async (resolve, reject) => {

            const data = await fetch('/public/book.json')
            const book = await data.json();

            console.log(book)

            return resolve(book);
        });
    }

    const state = {
        data: await FetchBook(),
        currentPage: 1,
        pages: Array.from(document.getElementsByClassName('content')),
        transition: false,
    }

    console.log(state);


    const Render = () => {
        state.pages.forEach((page, index) => {

            if (index == 2) {
                return;
            }

            const pageElement = document.getElementById(`p${index + 1}`);
            const contentElement = pageElement.firstElementChild;


            contentElement.replaceChildren([]);

            const pageData = state.data.pages[index];
            const title = document.createElement('h1');

            // Custom ID's
            if (pageData.id != null) { contentElement.id = pageData.id; } else { contentElement.id = 'page'; }

            title.textContent = pageData.title;
            contentElement.appendChild(title);


            pageData.sections.forEach(section => {
                const sectionElement = document.createElement('div');
                sectionElement.className = "section"

                // Optional - title
                if (section.title != null) {
                    const titleElement = document.createElement('h2');
                    titleElement.textContent = section.title;
                    titleElement.className = "section-title";
                    contentElement.appendChild(titleElement);
                }

                section.content.forEach(text => {
                    const textElement = document.createElement('h4');
                    textElement.textContent = text;
                    sectionElement.appendChild(textElement);
                });



                // Optional - image
                if (section.image != null) {
                    const imageElement = document.createElement('img');
                    imageElement.src = section.image;
                    sectionElement.appendChild(imageElement);
                }

                contentElement.appendChild(sectionElement);
            });
        });
    }


    const NextPage = () => {
        // ANIMATION
        document.documentElement.style.setProperty('--page-opacity', 0);
        document.getElementById('p3').style.transition = 'transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1), box-shadow .35s ease-in-out';
        document.getElementById('p3').style.transform = 'rotateY(-170deg)';
        document.getElementById('p3').style.opacity = '100%';

        state.transition = true;

        setTimeout(() => {
            state.data.pages = shiftPage(state.data.pages);

            // ANIMATION
            document.documentElement.style.setProperty('--page-opacity', 1);

            // RENDER
            Render();

            // ANIMATION
            document.getElementById('p3').style.opacity = '0%';
            document.getElementById('p3').style.transition = 'none';
            document.getElementById('p3').style.transform = 'rotateY(-7deg)';
            state.transition = false;
        }, 910);

    }


    const shiftPage = (pages = []) => {
        let p = pages.shift()
        pages.push(p);
        p = pages.shift()
        pages.push(p);

        return pages;
    }

    document.addEventListener('mousedown', (e) => {
        if (state.transition) return;
        NextPage();
    });

    Render();
}
