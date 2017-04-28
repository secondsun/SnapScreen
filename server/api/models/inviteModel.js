'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InviteeSchema = new Schema({
  id: String,
  status: {
    type: [
      {
        type: String,
        enum: ['accepted', 'declined', 'unanswered'],
      },
    ],
    default: ['unanswered'],
  },
});

var InviteSchema = new Schema({
  title: String,
  showtime: Object,
  location: {
    name: String,
    lat: String,
    long: String,
    address: String,
  },
  movie: Object,
  organizer: Object,
  runtime: String,
  rating: String,
  thumbnail: String,
  backdrop: String,
  myStatus: String,
  organizer: {
    name: String,
  },
  notes: String,
  movie_id: String,
  host_id: String,
  invitees: [InviteeSchema],
});

module.exports = mongoose.model('Invites', InviteSchema);
