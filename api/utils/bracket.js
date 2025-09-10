// utils/bracket.js
const TournamentMatch = require("../models/Tournaments");

/**
 * Blog ID’lerini alır ve round için eşleşmeler oluşturur
 */
async function createMatches(blogIds, round = 1) {
  // Bu round'da zaten oluşturulmuş maçları al
  const existingMatches = await TournamentMatch.find({ round });
  const usedBlogIds = new Set();

  existingMatches.forEach((match) => {
    if (match.blog1) usedBlogIds.add(match.blog1.toString());
    if (match.blog2) usedBlogIds.add(match.blog2.toString());
  });

  // Bu round için kullanılabilir blogları filtrele
  const availableBlogs = blogIds.filter((id) => !usedBlogIds.has(id.toString()));

  // Çiftler halinde eşleştir
  for (let i = 0; i < availableBlogs.length - 1; i += 2) {
    await TournamentMatch.create({
      blog1: availableBlogs[i],
      blog2: availableBlogs[i + 1],
      round: round,
    });
  }

  // Tek blog kaldıysa onu bekletebilirsin
  if (availableBlogs.length % 2 === 1) {
    console.log("Tek blog kaldı, bir sonraki round'a taşınabilir:", availableBlogs[availableBlogs.length - 1]);
  }
}

/**
 * Round tamamlandığında bir sonraki round için eşleşmeleri başlatır
 */
async function nextRound(completedRound) {
  const matches = await TournamentMatch.find({ round: completedRound, completed: true });
  const winners = matches.map((m) => m.winner.toString());

  for (let i = 0; i < winners.length - 1; i += 2) {
    await TournamentMatch.create({
      blog1: winners[i],
      blog2: winners[i + 1],
      round: completedRound + 1,
    });
  }

  if (winners.length % 2 === 1) {
    console.log("Tek kazanan kaldı, bir sonraki round'a bekletebilirsin:", winners[winners.length - 1]);
  }
}

module.exports = { createMatches, nextRound };
