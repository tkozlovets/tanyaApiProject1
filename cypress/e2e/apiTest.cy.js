describe('Posts suit', () => {


  it('1.Get all posts', () => {
    cy.request('GET', '/posts').then(response => {
      expect(response.status).to.be.equal(200);

    });
  });


  it('2.Get first 10 posts', () => {
    cy.request({
      method: 'GET',
      url: '/posts',
      qs: {
        _limit: 10
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.lengthOf(10);

    });
  });

  it('3.Get posts with id=55.60', () => {
    cy.request({
      method: 'GET',
      url: '/posts?id=55&id=60',

    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.lengthOf(2);

      expect(response.body[0].id).to.eq(55);
      expect(response.body[1].id).to.eq(60);

    });

  });

  it('4.Create object and return status code 401', () => {
    cy.request({
      method: 'POST',
      url: '/664/posts',
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
      }
    }).then((response) => {
      expect(response.status).to.eq(401);
    });

  });

  it('5.Create post with adding access token in header', () => {

    const accessToken = 'xxx.xxx.xxx';

      cy.request({
      method: 'POST',
      url: '/664/posts',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
          body: {
            title: 'New post1',
            content: 'New content1'
          },
      failOnStatusCode: false,

     }).then((response) => {
      expect(response.status).to.eq(201);
    });

  });

  it('6.Create post entity and verify that the entity is created', () => {
    const postBody = {

      title: "Tanya post",
      body: "Hello"
    };

    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        'Content-Type': 'application/json'
      },
      body: postBody
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.deep.equal({ ...postBody, id: response.body.id });

    });

  });

  it('7. Update non-existing entity', () => {
    const postId = '200';

    cy.request({
      method: 'PUT',
      url: `/posts/${postId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });


  it('8. Create post entity and update the created entity', () => {
    let createdPostId;

    // Create new post
    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        title: 'New post',
        content: 'New content'
      }
    }).then((response) => {
      expect(response.status).to.eq(201); // Verify post is created
      createdPostId = response.body.id; // Save Id of the created post

      // Update created post
      cy.request({
        method: 'PUT',
        url: `/posts/${createdPostId}`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          title: 'Updated post',
          content: 'Updated content'
        }
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
      });
    });
  });

  it('9. Delete non-existing post entity. Verify HTTP response status code', () => {
    const nonExistentPostId = '200';

    cy.request({
      method: 'DELETE',
      url: `/posts/${nonExistentPostId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it('10.Create post entity, update the created entity, and delete the entity.', () => {
    let createdPostId;

    // Create new post
    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        title: 'New post',
        content: 'New content'
      }
    }).then((response) => {
      expect(response.status).to.eq(201); // Verify post is created
      createdPostId = response.body.id; // Save Id of the created post

      // Update created post
      cy.request({
        method: 'PUT',
        url: `/posts/${createdPostId}`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          title: 'Updated post',
          content: 'Updated content'
        }
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        it('Delete pet via DELETE request', () => {
          // sending DELETE request
          cy.request({
            method: 'DELETE',
            url: `/posts/${createdPostId}`,

          }).then(response => {

            expect(response.status).to.eq(200);

          });

          cy.request({
            method: 'GET',
            url: `/posts/${createdPostId}`,
            failOnStatusCode: false // Allows the test to continue even if the request fails
          }).then(response => {

            expect(response.status).to.eq(404);

          });
        });
      });
    });
  });
});
