package com.mahatbank.repository;

import com.mahatbank.model.ScheduledTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduledTransactionRepository extends JpaRepository<ScheduledTransaction, Long> {
    List<ScheduledTransaction> findByFromAccount_UserId(Long userId);
    List<ScheduledTransaction> findByStatus(ScheduledTransaction.ScheduleStatus status);
}