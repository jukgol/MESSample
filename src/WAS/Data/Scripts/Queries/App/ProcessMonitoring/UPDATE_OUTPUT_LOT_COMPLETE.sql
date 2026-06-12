UPDATE LOT
SET qty = :Qty,
    status = 'DONE'
WHERE lot_id = :LotId
