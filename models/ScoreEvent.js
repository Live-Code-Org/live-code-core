const mongoose = require('mongoose');
const { Schema } = mongoose;

const scoreEventSchema = new Schema(
    {
        // ---- 1. Shared fate & Context ----

        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author ID is required']
        },
        reviewerIds: [
            {type: Schema.Types.ObjectId, ref: 'User'},
        ],
        teamId: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        },

        // ---- 2. Event Details & Scoring ----

        eventType: {
            type: String,
            enum: ['pr_merged', 'code_review', 'issue_closed', 'revert_penalty'],
            required: true
        },
        pointsDelta: {
            type: Number,
            required: [true, 'Points delta is required'],
            validate: {
                validator: function (val) {
                    return val !== 0;
                },
                message:'Points delta cannot be zero',
            },
        },
        sourceRef:{
            type: String
        },

        // ---- 3. 14-day delay ----

        status: {
            type: String,
            enum: ['pending', 'vested', 'revoked'],
            default: 'pending'
        },
        vestsAt: {
            type: Date,
            default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            required: true
        },

        
    },

{timestamps: true});

// ---- 4. Escrow Worker Index ----

scoreEventSchema.index({
    status: 1,
    vestsAt: 1
});

module.exports = mongoose.model('ScoreEvent', scoreEventSchema);
