package com.gradsync.stats.service;

import com.gradsync.stats.entity.AlumniSpotlight;
import com.gradsync.stats.entity.BatchStat;
import com.gradsync.stats.repository.AlumniSpotlightRepository;
import com.gradsync.stats.repository.BatchStatRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final BatchStatRepository batchStatRepository;
    private final AlumniSpotlightRepository alumniSpotlightRepository;

    public List<BatchStat> getAllBatches() {
        return batchStatRepository.findAllByOrderByGraduationYearDesc();
    }
    
    public BatchStat getBatchByYear(Integer year) {
        return batchStatRepository.findAll().stream()
                .filter(b -> b.getGraduationYear().equals(year))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Batch not found"));
    }

    public List<AlumniSpotlight> getAlumniSpotlights() {
        return alumniSpotlightRepository.findAll();
    }

    @PostConstruct
    public void seedData() {
        if (batchStatRepository.count() == 0) {
            BatchStat b2022 = new BatchStat(null, 2018, 2022, 46, 42, 6.8, 91.3, false, 
                    Arrays.asList("TCS", "Infosys", "Wipro", "Cognizant", "Amazon"),
                    Arrays.asList("Highest Selection in TCS", "100% Core Placement"));

            BatchStat b2023 = new BatchStat(null, 2019, 2023, 20, 18, 4.1, 90.0, false,
                    Arrays.asList("TCS", "Infosys", "Wipro", "Cognizant", "Accenture"),
                    Arrays.asList("Excellent Service Track Record"));

            BatchStat b2024 = new BatchStat(null, 2020, 2024, 18, 17, 9.2, 94.4, false,
                    Arrays.asList("Microsoft", "Google", "Amazon", "Flipkart", "Paytm"),
                    Arrays.asList("Product Tier Specialists"));
            
            BatchStat b2025 = new BatchStat(null, 2021, 2025, 300, 0, 0.0, 0.0, true,
                   Arrays.asList(), Arrays.asList("Currently Pursuing"));

            batchStatRepository.saveAll(Arrays.asList(b2025, b2024, b2023, b2022));
        }

        if (alumniSpotlightRepository.count() == 0) {
            AlumniSpotlight a1 = new AlumniSpotlight(null, "Priya Sharma", "2020", "Google", "Senior Software Engineer", 
                    "San Francisco, USA", "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
                    "From PIEMR to Silicon Valley - leading AI initiatives at Google and mentoring 50+ students.",
                    Arrays.asList("AI/ML Expert", "Tech Lead", "Mentor"), "#");

            AlumniSpotlight a2 = new AlumniSpotlight(null, "Rahul Patel", "2019", "Microsoft", "Product Manager",
                    "Seattle, USA", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
                    "Building products used by millions worldwide and driving innovation in cloud computing.",
                    Arrays.asList("Product Strategy", "Team Leadership", "Innovation"), "#");

            AlumniSpotlight a3 = new AlumniSpotlight(null, "Anita Desai", "2018", "Goldman Sachs", "Vice President",
                    "New York, USA", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
                    "Leading fintech innovations and managing multi-million dollar portfolios in investment banking.",
                    Arrays.asList("Finance Expert", "VP Level", "Global Impact"), "#");

            alumniSpotlightRepository.saveAll(Arrays.asList(a1, a2, a3));
        }
    }
}
